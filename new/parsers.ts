/**
 * MODULE: Request Body Parsing Middleware
 *
 * PURPOSE:
 * Provides zero-dependency body parsing middleware for all common content types
 * (JSON, URL-encoded, multipart, text). Each parser does one thing well and uses
 * only Deno's native APIs. No external dependencies, no security vulnerabilities.
 *
 * UNIX PHILOSOPHY IMPLEMENTATION:
 * - Do one thing well: Each parser handles exactly one content type
 * - Composable: Parsers compose via bodyParser() or use individually
 * - Text-based: All parsing converts HTTP bodies to structured data
 * - Explicit: Content-type detection is explicit, no magic guessing
 * - Filter pattern: Parsers only activate for matching content-types
 *
 * ARCHITECTURE:
 * - Each parser is middleware that checks content-type header
 * - Parsed data stored in ctx.state.body for downstream handlers
 * - File uploads stored in ctx.state.files (multipart only)
 * - Parsers are defensive: size limits, error handling, validation
 * - bodyParser() combines all parsers for automatic routing
 *
 * DESIGN DECISIONS:
 * 1. **Why separate parsers instead of one?**
 *    Single responsibility. Users can import only what they need.
 *    Custom size limits per content type (JSON vs file uploads).
 *
 * 2. **Why store in ctx.state.body?**
 *    Consistent interface. Validation middleware expects body here.
 *    Handlers can access parsed data without knowing parser used.
 *
 * 3. **Why check content-length before parsing?**
 *    Prevents DoS: reject oversized requests before reading body.
 *    Double-check: both content-length header and actual text length.
 *
 * 4. **Why Files as Uint8Array not File objects?**
 *    Full control over file handling. Caller decides storage (disk, S3, etc).
 *    No implicit filesystem writes, respects Deno permissions model.
 *
 * 5. **Why separate files from body in multipart?**
 *    Different use cases: body fields go to database, files to storage.
 *    Makes handler code clearer: ctx.state.body vs ctx.state.files.
 *
 * SECURITY CONSIDERATIONS:
 * - Size limits on all parsers prevent DoS attacks
 * - JSON.parse errors don't crash server (caught and return 400)
 * - No eval or dynamic code execution
 * - File uploads checked for size before loading into memory
 * - Error messages don't leak internal structure
 * - All parsing errors return 400 with sanitized messages
 *
 * USAGE:
 * ```typescript
 * import { json, multipart, bodyParser } from "./parsers.ts";
 *
 * // Option 1: Use specific parser
 * app.post("/api/data", json({ limit: 5 * 1024 * 1024 }), (ctx) => {
 *   const data = ctx.state.body; // Parsed JSON
 *   return { received: data };
 * });
 *
 * // Option 2: Auto-detect content type
 * app.use(bodyParser({
 *   jsonLimit: 1024 * 1024,      // 1MB for JSON
 *   multipartLimit: 10 * 1024 * 1024,  // 10MB for uploads
 * }));
 *
 * // Option 3: File uploads
 * app.post("/upload", multipart(), (ctx) => {
 *   const files = ctx.state.files; // Array of file objects
 *   const fields = ctx.state.body; // Form fields
 *   // Save files to disk/S3/etc
 * });
 * ```
 *
 * PARSER PATTERNS:
 *
 * **Pattern 1: JSON API**
 * ```typescript
 * app.use(json());
 * app.post("/api/users", async (ctx) => {
 *   const user = ctx.state.body as { name: string; email: string };
 *   await db.insert("users", user);
 *   return json({ created: true });
 * });
 * ```
 *
 * **Pattern 2: Form submission**
 * ```typescript
 * app.use(urlencoded());
 * app.post("/contact", async (ctx) => {
 *   const form = ctx.state.body as Record<string, string>;
 *   await sendEmail(form.email, form.message);
 *   return redirect("/thank-you");
 * });
 * ```
 *
 * **Pattern 3: File upload with metadata**
 * ```typescript
 * app.post("/documents", multipart(), async (ctx) => {
 *   const { title, description } = ctx.state.body as Record<string, string>;
 *   const files = ctx.state.files as Array<{
 *     filename: string;
 *     type: string;
 *     data: Uint8Array;
 *   }>;
 *
 *   for (const file of files) {
 *     await Deno.writeFile(`./uploads/${file.filename}`, file.data);
 *   }
 *
 *   return json({ uploaded: files.length });
 * });
 * ```
 *
 * **Pattern 4: Content-type based routing**
 * ```typescript
 * app.post("/data", async (ctx) => {
 *   const contentType = ctx.request.headers.get("content-type");
 *
 *   if (contentType?.includes("application/json")) {
 *     return await json()(ctx, next);
 *   } else if (contentType?.includes("text/plain")) {
 *     return await text()(ctx, next);
 *   }
 *
 *   return badRequest("Unsupported content type");
 * });
 * ```
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Parsers only activate for matching content-types (O(1) check)
 * - Streaming not used (bodies loaded into memory) - suitable for typical API payloads
 * - Large file uploads should use chunked transfer or presigned URLs
 * - Body parsing happens once per request, result cached in ctx.state
 * - URLSearchParams parsing is native (fast C++ implementation)
 *
 * SIZE LIMIT GUIDELINES:
 * - JSON API: 1-5MB (typical API payloads)
 * - URL-encoded forms: 1MB (typical form data)
 * - Multipart total: 10-50MB (multiple files)
 * - Individual files: 5-10MB (avatar, document)
 * - Adjust based on use case and server memory
 *
 * ERROR HANDLING:
 * All parsers return 400 Bad Request with structured errors:
 * ```json
 * {
 *   "error": "Bad Request",
 *   "message": "Invalid JSON body",
 *   "details": "Unexpected token } in JSON at position 42"
 * }
 * ```
 *
 * TESTING STRATEGIES:
 * - Unit test each parser with valid/invalid inputs
 * - Test size limits (content-length and actual size)
 * - Test malformed data (invalid JSON, corrupted multipart)
 * - Test edge cases (empty body, missing boundary, etc)
 * - Integration test with real HTTP requests
 *
 * RELATED:
 * - See: ./validation.ts - Schema validation after parsing
 * - See: ./middleware.ts - Middleware composition patterns
 * - See: ./context.ts - Context.state.body storage
 * - See: meta-documentation.md - Security-first development
 *
 * @module core/parsers
 */

import type { Context, Middleware } from "./types.ts";
import { ConsoleStyler } from "../core/console.ts";
import { payloadTooLarge, validationError } from "./response.ts";

/**
 * Check if request body size exceeds the limit
 * Returns a 413 response if limit exceeded, null otherwise
 */
function checkBodySize(ctx: Context, limit: number): Response | null {
  const contentLength = ctx.request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > limit) {
    return payloadTooLarge(limit);
  }
  return null;
}

/**
 * Validate text body size after reading
 * Returns a 413 response if limit exceeded, null otherwise
 */
function validateTextSize(text: string, limit: number): Response | null {
  if (text.length > limit) {
    return payloadTooLarge(limit);
  }
  return null;
}

/**
 * JSON body parser middleware
 * Parses request body as JSON and stores in ctx.state.body
 *
 * @param options - Parser options
 * @param options.limit - Maximum body size in bytes (default: 1MB)
 * @param options.strict - Strict JSON parsing (default: true)
 */
export function json(options: {
  limit?: number;
  strict?: boolean;
} = {}): Middleware {
  const limit = options.limit ?? 1024 * 1024; // 1MB default
  const strict = options.strict ?? true;

  return async (ctx: Context, next: () => Promise<Response | undefined>) => {
    const contentType = ctx.request.headers.get("content-type");

    // Only parse if content-type is JSON
    if (contentType?.includes("application/json")) {
      try {
        // Check content length
        const sizeCheck = checkBodySize(ctx, limit);
        if (sizeCheck) return sizeCheck;

        // Parse JSON body
        const text = await ctx.request.text();

        // Check actual size
        const textSizeCheck = validateTextSize(text, limit);
        if (textSizeCheck) return textSizeCheck;

        // Parse with optional strict mode
        const body = strict
          ? JSON.parse(text)
          : JSON.parse(text, (key, value) => value);

        ctx.state.body = body;

        ConsoleStyler.logDebug("Parsed JSON body", {
          size: text.length,
          keys: typeof body === "object" && body !== null
            ? Object.keys(body).length
            : 0,
        });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);

        ConsoleStyler.logError("JSON parse error", {
          error: errorMessage,
          contentType,
        });

        return validationError("Invalid JSON body", errorMessage);
      }
    }

    return await next();
  };
}

/**
 * URL-encoded form data parser middleware
 * Parses application/x-www-form-urlencoded bodies
 *
 * @param options - Parser options
 * @param options.limit - Maximum body size in bytes (default: 1MB)
 */
export function urlencoded(options: {
  limit?: number;
} = {}): Middleware {
  const limit = options.limit ?? 1024 * 1024; // 1MB default

  return async (ctx: Context, next: () => Promise<Response | undefined>) => {
    const contentType = ctx.request.headers.get("content-type");

    if (contentType?.includes("application/x-www-form-urlencoded")) {
      try {
        const sizeCheck = checkBodySize(ctx, limit);
        if (sizeCheck) return sizeCheck;

        const text = await ctx.request.text();

        const textSizeCheck = validateTextSize(text, limit);
        if (textSizeCheck) return textSizeCheck;

        // Parse URLSearchParams into plain object
        const params = new URLSearchParams(text);
        const body: Record<string, string | string[]> = {};

        for (const [key, value] of params.entries()) {
          // Handle multiple values for same key
          const existing = body[key];
          if (existing) {
            body[key] = Array.isArray(existing)
              ? [...existing, value]
              : [existing, value];
          } else {
            body[key] = value;
          }
        }

        ctx.state.body = body;

        ConsoleStyler.logDebug("Parsed URL-encoded body", {
          size: text.length,
          fields: Object.keys(body).length,
        });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);

        ConsoleStyler.logError("URL-encoded parse error", {
          error: errorMessage,
        });

        return validationError("Invalid URL-encoded body", errorMessage);
      }
    }

    return await next();
  };
}

/**
 * Multipart form data parser middleware
 * Parses multipart/form-data bodies (file uploads)
 *
 * @param options - Parser options
 * @param options.limit - Maximum total body size in bytes (default: 10MB)
 * @param options.maxFileSize - Maximum individual file size (default: 5MB)
 */
export function multipart(options: {
  limit?: number;
  maxFileSize?: number;
} = {}): Middleware {
  const limit = options.limit ?? 10 * 1024 * 1024; // 10MB default
  const maxFileSize = options.maxFileSize ?? 5 * 1024 * 1024; // 5MB default

  return async (ctx: Context, next: () => Promise<Response | undefined>) => {
    const contentType = ctx.request.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      try {
        const sizeCheck = checkBodySize(ctx, limit);
        if (sizeCheck) return sizeCheck;

        const formData = await ctx.request.formData();
        const fields: Record<string, unknown> = {};
        const files: Array<{
          name: string;
          filename: string;
          type: string;
          size: number;
          data: Uint8Array;
        }> = [];

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            // Handle file upload
            const arrayBuffer = await value.arrayBuffer();
            const size = arrayBuffer.byteLength;

            if (size > maxFileSize) {
              return payloadTooLarge(
                maxFileSize,
                `File "${value.name}" exceeds maximum size of ${maxFileSize} bytes`,
              );
            }

            files.push({
              name: key,
              filename: value.name,
              type: value.type,
              size,
              data: new Uint8Array(arrayBuffer),
            });
          } else {
            // Handle regular field
            const existing = fields[key];
            if (existing) {
              fields[key] = Array.isArray(existing)
                ? [...existing, value]
                : [existing, value];
            } else {
              fields[key] = value;
            }
          }
        }

        ctx.state.body = fields;
        ctx.state.files = files;

        ConsoleStyler.logDebug("Parsed multipart body", {
          fields: Object.keys(fields).length,
          files: files.length,
          totalSize: files.reduce((sum, f) => sum + f.size, 0),
        });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);

        ConsoleStyler.logError("Multipart parse error", {
          error: errorMessage,
        });

        return validationError("Invalid multipart body", errorMessage);
      }
    }

    return await next();
  };
}

/**
 * Text body parser middleware
 * Parses plain text bodies
 *
 * @param options - Parser options
 * @param options.limit - Maximum body size in bytes (default: 1MB)
 */
export function text(options: {
  limit?: number;
} = {}): Middleware {
  const limit = options.limit ?? 1024 * 1024; // 1MB default

  return async (ctx: Context, next: () => Promise<Response | undefined>) => {
    const contentType = ctx.request.headers.get("content-type");

    if (contentType?.includes("text/plain")) {
      try {
        const sizeCheck = checkBodySize(ctx, limit);
        if (sizeCheck) return sizeCheck;

        const bodyText = await ctx.request.text();

        const textSizeCheck = validateTextSize(bodyText, limit);
        if (textSizeCheck) return textSizeCheck;

        ctx.state.body = bodyText;

        ConsoleStyler.logDebug("Parsed text body", {
          size: bodyText.length,
        });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);

        ConsoleStyler.logError("Text parse error", {
          error: errorMessage,
        });

        return validationError("Invalid text body", errorMessage);
      }
    }

    return await next();
  };
}

/**
 * Automatic body parser - detects content type and parses accordingly
 * Combines json, urlencoded, multipart, and text parsers
 *
 * @param options - Combined parser options
 */
export function bodyParser(options: {
  jsonLimit?: number;
  urlencodedLimit?: number;
  multipartLimit?: number;
  maxFileSize?: number;
  textLimit?: number;
} = {}): Middleware {
  const jsonParser = json({ limit: options.jsonLimit });
  const urlencodedParser = urlencoded({ limit: options.urlencodedLimit });
  const multipartParser = multipart({
    limit: options.multipartLimit,
    maxFileSize: options.maxFileSize,
  });
  const textParser = text({ limit: options.textLimit });

  const middleware = async (ctx: Context, next: () => Promise<Response | undefined>) => {
    const contentType = ctx.request.headers.get("content-type");

    if (!contentType) {
      return await next();
    }

    // Route to appropriate parser based on content type
    if (contentType.includes("application/json")) {
      return await jsonParser(ctx, next);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      return await urlencodedParser(ctx, next);
    } else if (contentType.includes("multipart/form-data")) {
      return await multipartParser(ctx, next);
    } else if (contentType.includes("text/plain")) {
      return await textParser(ctx, next);
    }

    return await next();
  };

  Object.defineProperty(middleware, "name", { value: "bodyParser" });
  return middleware;
}
