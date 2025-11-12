/**
 * MODULE: HTTP Response Helper Utilities
 *
 * PURPOSE:
 * Provides clean, type-safe helper functions for creating common HTTP responses.
 * Each function does one thing: create a properly formatted Response object with
 * correct headers and status codes. Zero dependencies, uses only Web Standards.
 *
 * UNIX PHILOSOPHY IMPLEMENTATION:
 * - Do one thing well: Each helper creates one type of response (JSON, HTML, redirect)
 * - Composable: Helpers return standard Response objects, work anywhere
 * - Text-based: All responses are text-based (JSON, HTML, plain text)
 * - Explicit: Status codes and content-types are explicit, no magic
 * - Small tools: Each function is 3-5 lines, easy to understand and audit
 *
 * ARCHITECTURE:
 * - Pure functions: Input → Response, no side effects
 * - Web Standards: Uses only standard Response API
 * - Type-safe: TypeScript ensures correct usage at compile time
 * - Consistent interface: All helpers accept data + optional options
 * - Framework-agnostic: Works with any HTTP server
 *
 * DESIGN DECISIONS:
 * 1. **Why separate functions instead of one response builder?**
 *    Clarity. json() clearly creates JSON response, html() creates HTML.
 *    Tree-shaking: unused helpers eliminated from bundle.
 *
 * 2. **Why return Response instead of custom type?**
 *    Web Standards compatibility. Works with Deno.serve, middleware, fetch.
 *    No framework lock-in, responses are portable.
 *
 * 3. **Why status code defaults?**
 *    Follow HTTP conventions: 200 for success, 302 for redirect, etc.
 *    Users can override but defaults handle 90% of cases.
 *
 * 4. **Why include error helpers (notFound, badRequest)?**
 *    Common patterns. Prevents inconsistent error responses across app.
 *    Ensures errors are JSON with standard structure.
 *
 * 5. **Why add payloadTooLarge() and validationError()?**
 *    DRY principle: eliminates duplicate error handling across parsers.
 *    12+ instances of manual Response creation reduced to helper calls.
 *    Consistent error format for all body parsing failures.
 *
 * 6. **Why no response body validation?**
 *    Trust but verify. Users should validate before passing to helpers.
 *    Validation middleware is separate concern (see validation.ts).
 *
 * SECURITY CONSIDERATIONS:
 * - No script injection: helpers don't execute code from data
 * - Content-Type headers prevent MIME confusion attacks
 * - Status codes prevent HTTP response splitting
 * - JSON.stringify() is safe (no eval or code execution)
 * - Error messages should be sanitized before passing to helpers
 *
 * AVAILABLE HELPERS:
 *
 * **Core Response Builders:**
 * - json(data, options?) - JSON response with automatic content-type
 * - text(content, options?) - Plain text response
 * - html(content, options?) - HTML response
 * - redirect(url, status?) - HTTP redirect (default 302)
 * - status(code, data?) - Custom status code
 * - noContent() - 204 No Content (for successful DELETE)
 *
 * **Error Response Helpers (4xx):**
 * - badRequest(message?) - 400 Bad Request
 * - unauthorized(message?) - 401 Unauthorized (auth required)
 * - forbidden(message?) - 403 Forbidden (insufficient permissions)
 * - notFound(message?) - 404 Not Found
 * - payloadTooLarge(limit, details?) - 413 Payload Too Large
 *
 * **Error Response Helpers (5xx):**
 * - internalError(message?) - 500 Internal Server Error
 *
 * **Parser-Specific Helpers:**
 * - validationError(message, details?) - 400 with structured error details
 *
 * USAGE:
 * ```typescript
 * import { json, html, redirect, notFound, payloadTooLarge } from "./response.ts";
 *
 * // JSON API response
 * app.get("/api/users", () => {
 *   return json({ users: [{ id: 1, name: "Alice" }] });
 * });
 *
 * // HTML page
 * app.get("/", () => {
 *   return html("<h1>Welcome</h1>");
 * });
 *
 * // Redirect
 * app.get("/old-path", () => {
 *   return redirect("/new-path", 301); // Permanent redirect
 * });
 *
 * // Error responses
 * app.get("/users/:id", (ctx) => {
 *   const user = findUser(ctx.params.id);
 *   if (!user) return notFound("User not found");
 *   return json(user);
 * });
 *
 * // Body size validation (used by parsers)
 * if (bodySize > limit) {
 *   return payloadTooLarge(limit);
 * }
 * ```
 *
 * RESPONSE PATTERNS:
 *
 * **Pattern 1: REST API responses**
 * ```typescript
 * // Success with data
 * return json({ data: result, meta: { count: 10 } });
 *
 * // Created resource
 * return json({ id: newId }, { status: 201 });
 *
 * // No content (delete successful)
 * return noContent();
 * ```
 *
 * **Pattern 2: Error handling**
 * ```typescript
 * // Not found
 * return notFound("Resource not found");
 *
 * // Validation error
 * return badRequest("Invalid input");
 *
 * // Unauthorized
 * return unauthorized("Invalid credentials");
 *
 * // Forbidden
 * return forbidden("Insufficient permissions");
 *
 * // Server error
 * return internalError("Something went wrong");
 * ```
 *
 * **Pattern 3: Custom status codes**
 * ```typescript
 * // Custom success status
 * return json({ accepted: true }, { status: 202 });
 *
 * // Custom error
 * return status(429, { error: "Too many requests" });
 * ```
 *
 * **Pattern 4: Custom headers**
 * ```typescript
 * return json(data, {
 *   headers: {
 *     "Cache-Control": "max-age=3600",
 *     "X-Custom-Header": "value",
 *   },
 * });
 * ```
 *
 * PERFORMANCE CONSIDERATIONS:
 * - All helpers are O(1) operations (no loops or recursion)
 * - JSON.stringify() is native (fast C++ implementation)
 * - No unnecessary object cloning or deep copies
 * - Response objects are lightweight (just headers + body)
 * - Headers object creation is cheap
 *
 * HTTP STATUS CODE GUIDE:
 * - 200 OK: Successful GET, PUT, PATCH
 * - 201 Created: Successful POST creating resource
 * - 204 No Content: Successful DELETE
 * - 400 Bad Request: Client error (invalid input)
 * - 401 Unauthorized: Authentication required
 * - 403 Forbidden: Authenticated but not authorized
 * - 404 Not Found: Resource doesn't exist
 * - 500 Internal Server Error: Server error
 *
 * REDIRECT STATUS CODES:
 * - 301 Moved Permanently: Old URL permanently replaced
 * - 302 Found (default): Temporary redirect
 * - 303 See Other: Redirect after POST to GET
 * - 307 Temporary Redirect: Preserve HTTP method
 * - 308 Permanent Redirect: Preserve HTTP method
 *
 * CONTENT TYPE BEST PRACTICES:
 * - Always set Content-Type header explicitly
 * - Use charset=utf-8 for text responses
 * - JSON: application/json (no charset needed per RFC)
 * - HTML: text/html; charset=utf-8
 * - Plain text: text/plain; charset=utf-8
 *
 * TESTING STRATEGIES:
 * - Unit test each helper with various inputs
 * - Verify status codes match expectations
 * - Verify Content-Type headers are correct
 * - Test custom headers merge with defaults
 * - Verify Response objects work with Deno.serve
 *
 * RELATED:
 * - See: ./middleware.ts - Middleware can return these responses
 * - See: ./context.ts - Handlers return Response objects
 * - See: ./server.ts - Server sends responses to clients
 * - See: meta-documentation.md - Explicit over implicit principle
 *
 * @module core/response
 */

export interface ResponseOptions {
  status?: number;
  headers?: HeadersInit;
}

/**
 * Create a JSON response
 */
export function json(data: unknown, options: ResponseOptions = {}): Response {
  return new Response(JSON.stringify(data), {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Create a text response
 */
export function text(content: string, options: ResponseOptions = {}): Response {
  return new Response(content, {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...options.headers,
    },
  });
}

/**
 * Create an HTML response
 */
export function html(content: string, options: ResponseOptions = {}): Response {
  return new Response(content, {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...options.headers,
    },
  });
}

/**
 * Create a redirect response
 */
export function redirect(url: string, status = 302): Response {
  return new Response(null, {
    status,
    headers: {
      Location: url,
    },
  });
}

/**
 * Create a 404 Not Found response
 */
export function notFound(message = "Not Found"): Response {
  return json({ error: message }, { status: 404 });
}

/**
 * Create a 400 Bad Request response
 */
export function badRequest(message = "Bad Request"): Response {
  return json({ error: message }, { status: 400 });
}

/**
 * Create a 500 Internal Server Error response
 */
export function internalError(message = "Internal Server Error"): Response {
  return json({ error: message }, { status: 500 });
}

/**
 * Create a 403 Forbidden response
 */
export function forbidden(message = "Forbidden"): Response {
  return json({ error: message }, { status: 403 });
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorized(message = "Unauthorized"): Response {
  return json({ error: message }, { status: 401 });
}

/**
 * Create a no content response
 */
export function noContent(): Response {
  return new Response(null, { status: 204 });
}

/**
 * Create a response with custom status
 */
export function status(statusCode: number, data?: unknown): Response {
  if (data === undefined) {
    return new Response(null, { status: statusCode });
  }
  return json(data, { status: statusCode });
}

/**
 * Create a 413 Payload Too Large response
 *
 * Used by parsers and middleware to reject requests with oversized bodies.
 * Provides consistent error structure across all body size checks.
 *
 * @param limit - The size limit that was exceeded (in bytes)
 * @param details - Optional custom message (defaults to standard limit message)
 *
 * @example
 * ```typescript
 * // Standard usage (parsers)
 * if (bodySize > limit) {
 *   return payloadTooLarge(limit);
 * }
 *
 * // Custom message (file uploads)
 * return payloadTooLarge(maxFileSize, `File "${filename}" is too large`);
 * ```
 *
 * Response structure:
 * ```json
 * {
 *   "error": "Payload Too Large",
 *   "message": "Request body exceeds limit of 1048576 bytes"
 * }
 * ```
 */
export function payloadTooLarge(limit: number, details?: string): Response {
  return json({
    error: "Payload Too Large",
    message: details ?? `Request body exceeds limit of ${limit} bytes`,
  }, { status: 413 });
}

/**
 * Create a validation error response (400 Bad Request)
 *
 * Used by parsers to report body parsing failures (invalid JSON, malformed data).
 * Provides structured error responses with optional details for debugging.
 *
 * @param message - High-level error message (e.g., "Invalid JSON body")
 * @param details - Optional detailed error info (e.g., parser error message)
 *
 * @example
 * ```typescript
 * // JSON parse error
 * return validationError("Invalid JSON body", "Unexpected token } at position 42");
 *
 * // URL-encoded parse error
 * return validationError("Invalid URL-encoded body", error.message);
 *
 * // Multipart parse error
 * return validationError("Invalid multipart body", error.message);
 * ```
 *
 * Response structure (with details):
 * ```json
 * {
 *   "error": "Bad Request",
 *   "message": "Invalid JSON body",
 *   "details": "Unexpected token } at position 42"
 * }
 * ```
 *
 * Response structure (without details):
 * ```json
 * {
 *   "error": "Bad Request",
 *   "message": "Missing required field: email"
 * }
 * ```
 */
export function validationError(
  message: string,
  details?: string,
): Response {
  return json({
    error: "Bad Request",
    message,
    ...(details && { details }),
  }, { status: 400 });
}
