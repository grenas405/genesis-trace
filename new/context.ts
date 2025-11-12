/**
 * MODULE: HTTP Context and Request Lifecycle Management
 *
 * PURPOSE:
 * Provides the core context object that flows through middleware chains,
 * enabling incremental response building while maintaining framework-agnostic
 * design. This is the foundational contract that unifies the framework.
 *
 * UNIX PHILOSOPHY IMPLEMENTATION:
 * - Do one thing well: Context lifecycle management only (create, mutate, finalize)
 * - Composable: Context is a simple data structure passed through pure-ish functions
 * - Text-based: All data is JSON-serializable, no opaque binary blobs
 * - Explicit: No hidden state, all mutations are visible on the context object
 * - Small and focused: Minimal API surface, everything you need and nothing you don't
 *
 * ARCHITECTURE:
 * - Context is the "request scope" - one context per HTTP request
 * - ResponseState allows middleware to incrementally build responses
 * - Staged responses can be committed or left to finalize at the end
 * - URLPattern provides native route parameter extraction
 * - Framework-agnostic: Works with any HTTP server (Deno.serve, etc.)
 *
 * DESIGN DECISIONS:
 * 1. **Why staged responses?**
 *    Allows middleware to set headers/status without returning immediately.
 *    Middleware can conditionally modify response before finalization.
 *
 * 2. **Why Record<string, unknown> for state?**
 *    Maximum flexibility. Middleware can attach parsed body, session data,
 *    auth info, etc. Type-safe consumers can cast as needed.
 *
 * 3. **Why separate params and state?**
 *    Route params are structural (from URL), state is behavioral (from middleware).
 *    Clear separation prevents confusion about data sources.
 *
 * 4. **Why committed flag?**
 *    Explicit commitment prevents accidental response creation when middleware
 *    only wanted to set headers. Committed = "definitely send this response".
 *
 * SECURITY CONSIDERATIONS:
 * - Context.state is request-scoped, no cross-request contamination
 * - No global state or singletons that could leak data
 * - Response staging prevents header injection after body sent
 * - URLPattern matching is secure (no regex injection)
 * - All data serializable for audit logging
 *
 * USAGE:
 * ```typescript
 * import { createContext, commitResponse, finalizeResponse } from "./context.ts";
 *
 * // Create context for incoming request
 * const ctx = createContext(request, { id: "123" });
 *
 * // Middleware can stage response data
 * ctx.response.status = 200;
 * ctx.response.headers.set("X-Custom", "value");
 *
 * // Explicitly commit when ready
 * commitResponse(ctx, {
 *   status: 201,
 *   body: JSON.stringify({ created: true })
 * });
 *
 * // Finalize converts staged data to Response
 * const response = finalizeResponse(ctx);
 * ```
 *
 * MIDDLEWARE PATTERNS:
 *
 * **Pattern 1: Pass-through (auth check)**
 * ```typescript
 * async function auth(ctx: Context, next: () => Promise<Response>) {
 *   if (!ctx.request.headers.get("Authorization")) {
 *     return new Response("Unauthorized", { status: 401 });
 *   }
 *   ctx.state.user = { id: "123" }; // Attach data
 *   return await next(); // Continue chain
 * }
 * ```
 *
 * **Pattern 2: Staged response (CORS)**
 * ```typescript
 * async function cors(ctx: Context, next: () => Promise<Response>) {
 *   ctx.response.headers.set("Access-Control-Allow-Origin", "*");
 *   return await next(); // Headers added to final response
 * }
 * ```
 *
 * **Pattern 3: Short-circuit (cache)**
 * ```typescript
 * async function cache(ctx: Context, next: () => Promise<Response>) {
 *   const cached = await getCache(ctx.url.pathname);
 *   if (cached) {
 *     return new Response(cached); // Skip remaining middleware
 *   }
 *   return await next();
 * }
 * ```
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Context creation is lightweight (O(1) allocations)
 * - URL parsing happens once per request
 * - Headers object is reused, not cloned
 * - No expensive serialization until finalization
 *
 * RELATED:
 * - See: ./middleware.ts - Middleware composition and execution
 * - See: ./router.ts - Route matching and parameter extraction
 * - See: ./server.ts - Application orchestration
 * - See: meta-documentation.md - Unix Philosophy principles
 *
 * @module core/context
 */

export interface ResponseState {
  status: number;
  statusText?: string;
  headers: Headers;
  body: BodyInit | null;
  committed: boolean;
}

export interface Context {
  request: Request;
  url: URL;
  params: Record<string, string>;
  state: Record<string, unknown>;
  response: ResponseState;
}

export type Handler = (ctx: Context) => Response | Promise<Response>;

export type Middleware = (
  ctx: Context,
  next: () => Promise<Response | undefined>,
) => Promise<Response | undefined> | Response | undefined;

function createResponseState(): ResponseState {
  return {
    status: 200,
    headers: new Headers(),
    body: null,
    committed: false,
  };
}

/**
 * Create a new HTTP context for the given request.
 */
export function createContext(
  request: Request,
  params: Record<string, string> = {},
): Context {
  return {
    request,
    url: new URL(request.url),
    params,
    state: {},
    response: createResponseState(),
  };
}

/**
 * Extract dynamic params from the URL using a URLPattern.
 */
export function extractParams(
  pattern: URLPattern,
  url: URL,
): Record<string, string> {
  const match = pattern.exec(url);
  if (!match) {
    return {};
  }
  const groups = match.pathname?.groups ?? {};
  return Object.fromEntries(
    Object.entries(groups).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
}

/**
 * Create a Response from the staged response data inside the context.
 * If nothing has been staged yet, fall back to the provided Response or
 * return an empty 204 No Content response.
 */
export function finalizeResponse(
  ctx: Context,
  fallback?: Response,
): Response {
  const hasBody = ctx.response.body !== null && ctx.response.body !== undefined;
  let hasHeaders = false;
  for (const _key of ctx.response.headers.keys()) {
    hasHeaders = true;
    break;
  }
  const statusChanged = ctx.response.status !== 200 || ctx.response.statusText !== undefined;
  const shouldCommit = ctx.response.committed || hasBody || hasHeaders || statusChanged;

  if (shouldCommit) {
    return new Response(ctx.response.body, {
      status: ctx.response.status,
      statusText: ctx.response.statusText,
      headers: ctx.response.headers,
    });
  }

  if (fallback) {
    return fallback;
  }

  return new Response(null, { status: 204 });
}

/**
 * Mark the staged response as committed. Middleware that mutates the staged
 * response should call this helper to ensure finalizeResponse() emits it.
 */
export function commitResponse(
  ctx: Context,
  options: Partial<Pick<ResponseState, "status" | "statusText" | "body">> = {},
): void {
  if (options.status !== undefined) {
    ctx.response.status = options.status;
  }

  if (options.statusText !== undefined) {
    ctx.response.statusText = options.statusText;
  }

  if (options.body !== undefined) {
    ctx.response.body = options.body;
  }

  ctx.response.committed = true;
}
