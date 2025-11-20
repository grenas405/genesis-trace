// adapters/hono.ts
// @ts-nocheck - Disabled: depends on removed "new" directory
import type { Context as HonoContext, Next } from "jsr:@hono/hono@^4";
import { Logger } from "../core/logger.ts";
// Commented out - depends on removed "new" directory
// import {
//   type ContextSnapshotIncludeOptions,
//   createContext as createHttpContext,
//   snapshotContext,
// } from "../new/context.ts";

export interface HonoLoggerOptions {
  logger?: Logger;
  skipPaths?: string[];
  httpMetadata?: ContextSnapshotIncludeOptions;
}

export function honoLogger(
  options: HonoLoggerOptions = {},
): (c: HonoContext, next: Next) => Promise<void> {
  const logger = options.logger || new Logger();
  const skipPaths = options.skipPaths || [];
  const metadataInclude = options.httpMetadata;

  return async (c: HonoContext, next: Next) => {
    const start = performance.now();
    const requestId = crypto.randomUUID();
    const path = new URL(c.req.url).pathname;

    const params = c.req.param();
    const httpContext = createHttpContext(c.req.raw, params);
    const userAgent = c.req.header("user-agent");
    if (userAgent) {
      httpContext.state.userAgent = userAgent;
    }

    // Skip if in skip list
    if (skipPaths.includes(path)) {
      await next();
      return;
    }

    // Log incoming request
    logger.info(`→ ${c.req.method} ${path}`, {
      requestId,
      userAgent: c.req.header("user-agent"),
    });

    try {
      await next();

      const duration = performance.now() - start;
      const status = c.res.status;

      httpContext.response.status = status;
      httpContext.response.statusText = c.res.statusText;
      httpContext.response.headers = new Headers(c.res.headers);
      httpContext.response.committed = true;
      const httpSnapshot = snapshotContext(httpContext, {
        requestId,
        durationMs: duration,
        include: metadataInclude,
      });

      const metadata = {
        requestId,
        duration: `${duration.toFixed(2)}ms`,
        status,
        http: httpSnapshot,
      };

      if (status >= 200 && status < 300) {
        logger.success(`← ${status} ${c.req.method} ${path}`, metadata);
      } else if (status >= 400) {
        logger.warning(`← ${status} ${c.req.method} ${path}`, metadata);
      } else {
        logger.info(`← ${status} ${c.req.method} ${path}`, metadata);
      }
    } catch (error) {
      const duration = performance.now() - start;

      httpContext.response.status = c.res.status ?? 500;
      httpContext.response.statusText = c.res.statusText;
      httpContext.response.headers = new Headers(c.res.headers);
      httpContext.response.committed = true;
      const httpSnapshot = snapshotContext(httpContext, {
        requestId,
        durationMs: duration,
        include: metadataInclude,
      });

      logger.error(`← Error ${c.req.method} ${path}`, {
        requestId,
        duration: `${duration.toFixed(2)}ms`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        http: httpSnapshot,
      });
      throw error;
    }
  };
}
