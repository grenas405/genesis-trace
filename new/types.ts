/**
 * MODULE: Core Type Definitions
 *
 * PURPOSE:
 * Provides the foundational TypeScript type definitions for the entire HTTP
 * framework. These types form the contract between all modules, ensuring
 * type-safe composition and clear interfaces following Unix Philosophy.
 *
 * UNIX PHILOSOPHY IMPLEMENTATION:
 * - Do one thing well: Type definitions only, no implementation
 * - Composable: Types compose cleanly (Context, Handler, Middleware)
 * - Explicit: All types explicitly defined, no implicit any
 * - Text-based: Types document the text-based HTTP protocol
 * - Interface boundaries: Types define clear module boundaries
 *
 * ARCHITECTURE:
 * - Context: The request scope object that flows through middleware
 * - Handler: Functions that handle requests and return responses
 * - Middleware: Functions that can intercept and transform requests/responses
 * - Route: Complete route definition with pattern, handler, middleware
 * - Router: Interface for route registration and matching
 * - ServerConfig: Configuration for HTTP server
 *
 * DESIGN DECISIONS:
 * 1. **Why re-export from context.ts?**
 *    Single source of truth. Types defined where implemented.
 *    This file provides convenient central import location.
 *
 * 2. **Why Handler returns Response | Promise<Response>?**
 *    Flexibility. Sync handlers return Response, async use Promise.
 *    Framework handles both transparently via Promise.resolve().
 *
 * 3. **Why Middleware returns Response | undefined?**
 *    Undefined = continue chain (call next middleware/handler).
 *    Response = short-circuit chain (return immediately).
 *    Makes control flow explicit in type system.
 *
 * 4. **Why Route includes pattern AND path?**
 *    path: Original string for debugging/logging.
 *    pattern: Compiled URLPattern for efficient matching.
 *    Both useful for different purposes.
 *
 * 5. **Why HttpMethod is string union not enum?**
 *    String unions are more flexible and type-safe.
 *    Can extend with custom methods without modifying enum.
 *    Better IDE autocomplete and error messages.
 *
 * TYPE SAFETY PRINCIPLES:
 * - No 'any' types (except Record<string, unknown> for extensibility)
 * - All functions have explicit parameter and return types
 * - Readonly where appropriate (immutability)
 * - Strict null checks (undefined vs null explicitly handled)
 * - Generic types for extensibility (Context.state)
 *
 * CONTEXT TYPE DESIGN:
 * ```typescript
 * interface Context {
 *   request: Request;           // Web Standard Request
 *   url: URL;                   // Parsed URL (cached)
 *   params: Record<string, string>;  // Route parameters
 *   state: Record<string, unknown>;  // Middleware data storage
 *   response: ResponseState;    // Staged response data
 * }
 * ```
 *
 * Key insights:
 * - request is immutable (Web Standard)
 * - url is cached to avoid repeated parsing
 * - params are string-only (from URL)
 * - state is flexible (any middleware can add data)
 * - response allows incremental building
 *
 * HANDLER TYPE DESIGN:
 * ```typescript
 * type Handler = (ctx: Context) => Response | Promise<Response>;
 * ```
 *
 * Simple, clean signature:
 * - Takes Context (everything about the request)
 * - Returns Response (standard Web API)
 * - Can be sync or async (Promise)
 *
 * MIDDLEWARE TYPE DESIGN:
 * ```typescript
 * type Middleware = (
 *   ctx: Context,
 *   next: () => Promise<Response | undefined>
 * ) => Promise<Response | undefined> | Response | undefined;
 * ```
 *
 * More complex signature for flexibility:
 * - Takes Context and next function
 * - next() calls downstream middleware/handler
 * - Can return Response (short-circuit) or undefined (continue)
 * - Can be sync or async
 *
 * ROUTE TYPE DESIGN:
 * ```typescript
 * interface Route {
 *   method: HttpMethod;         // GET, POST, etc.
 *   path: string;               // Original path string
 *   pattern: URLPattern;        // Compiled pattern
 *   handler: Handler;           // Request handler
 *   middleware: Middleware[];   // Per-route middleware
 *   paramNames: string[];       // Extracted param names
 * }
 * ```
 *
 * Complete route specification:
 * - method for HTTP verb filtering
 * - path for debugging
 * - pattern for matching
 * - handler for execution
 * - middleware for pre/post processing
 * - paramNames for validation
 *
 * EXTENSIBILITY PATTERNS:
 *
 * **Pattern 1: Type-safe state**
 * ```typescript
 * interface AuthState {
 *   user: { id: string; role: string };
 *   token: string;
 * }
 *
 * // In middleware
 * ctx.state.user = { id: "123", role: "admin" };
 * ctx.state.token = "abc";
 *
 * // In handler (with type assertion)
 * const { user, token } = ctx.state as AuthState;
 * ```
 *
 * **Pattern 2: Custom context**
 * ```typescript
 * interface AppContext extends Context {
 *   db: DatabaseClient;
 *   logger: Logger;
 * }
 *
 * type AppHandler = (ctx: AppContext) => Response | Promise<Response>;
 * ```
 *
 * **Pattern 3: Typed middleware**
 * ```typescript
 * function requireAuth<T extends Context>(
 *   ctx: T,
 *   next: () => Promise<Response>
 * ): Response | Promise<Response> {
 *   // Type-safe middleware implementation
 * }
 * ```
 *
 * TYPE COMPATIBILITY:
 * - Context uses Web Standard types (Request, Response, URL, Headers)
 * - Compatible with Deno.serve, web workers, edge runtimes
 * - No framework-specific types in public API
 * - Easy to migrate to/from other frameworks
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Types are compile-time only (zero runtime cost)
 * - Type checking catches errors before runtime
 * - IDE autocomplete improves developer productivity
 * - Type guards prevent runtime type errors
 *
 * TESTING STRATEGIES:
 * - Use TypeScript compiler to verify type correctness
 * - Test type inference with various patterns
 * - Verify compatibility with Web Standard types
 * - Test generic type constraints
 * - Ensure no implicit any types
 *
 * RELATED:
 * - See: ./context.ts - Context implementation and creation
 * - See: ./router.ts - Router interface implementation
 * - See: ./server.ts - Application using these types
 * - See: meta-documentation.md - Explicit over implicit principle
 *
 * @module core/types
 */

import type {
  Context as BaseContext,
  Handler as BaseHandler,
  Middleware as BaseMiddleware,
  ResponseState,
} from "./context.ts";

export type {
  BaseContext as Context,
  BaseHandler as Handler,
  BaseMiddleware as Middleware,
  ResponseState,
};

// Local type aliases for use within this file
type Handler = BaseHandler;
type Middleware = BaseMiddleware;

/**
 * HTTP methods supported by the router
 */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD";

/**
 * Route definition
 */
export interface Route {
  method: HttpMethod;
  path: string;
  pattern: URLPattern;
  handler: Handler;
  middleware: Middleware[];
  paramNames: string[];
}

/**
 * Router interface
 */
export interface Router {
  get(path: string, handler: Handler, ...middleware: Middleware[]): Router;
  post(path: string, handler: Handler, ...middleware: Middleware[]): Router;
  put(path: string, handler: Handler, ...middleware: Middleware[]): Router;
  delete(path: string, handler: Handler, ...middleware: Middleware[]): Router;
  patch(path: string, handler: Handler, ...middleware: Middleware[]): Router;
  use(...middleware: Middleware[]): Router;
  group(prefix: string, callback: (router: Router) => void): Router;
}

/**
 * Server configuration
 */
export interface ServerConfig {
  port?: number;
  hostname?: string;
  onListen?: (params: { hostname: string; port: number }) => void;
}
