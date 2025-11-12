// adapters/oak.ts
import type { Context as OakContext, Next } from "jsr:@oak/oak@^17";
import { Logger } from "../core/logger.ts";
import {
  createContext as createHttpContext,
  snapshotContext,
  type ContextSnapshotIncludeOptions,
} from "../new/context.ts";

export interface OakLoggerOptions {
  logger?: Logger;
  skipPaths?: string[];
  logBody?: boolean;
  httpMetadata?: ContextSnapshotIncludeOptions;
}

export function oakLogger(options: OakLoggerOptions = {}): (ctx: OakContext, next: Next) => Promise<void> {
  const logger = options.logger || new Logger();
  const skipPaths = options.skipPaths || [];
  const logBody = options.logBody || false;
  const metadataInclude = options.httpMetadata;

  return async (ctx: OakContext, next: Next) => {
    const start = performance.now();
    const requestId = crypto.randomUUID();
    const path = ctx.request.url.pathname;

    const params = ((ctx as unknown as { params?: Record<string, string> }).params) ?? {};
    const httpContext = createHttpContext(
      new Request(ctx.request.url.toString(), {
        method: ctx.request.method,
        headers: ctx.request.headers,
      }),
      params,
    );
    if (ctx.request.ip) {
      httpContext.state.ip = ctx.request.ip;
    }
    const userAgent = ctx.request.headers.get("user-agent");
    if (userAgent) {
      httpContext.state.userAgent = userAgent;
    }

    // Skip if in skip list
    if (skipPaths.includes(path)) {
      await next();
      return;
    }

    // Log incoming request
    logger.info(`→ ${ctx.request.method} ${path}`, {
      requestId,
      ip: ctx.request.ip,
      userAgent: ctx.request.headers.get("user-agent"),
    });

    try {
      await next();

      const duration = performance.now() - start;
      const status = ctx.response.status;

      httpContext.response.status = status;
      httpContext.response.headers = new Headers(ctx.response.headers);
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
        logger.success(`← ${status} ${ctx.request.method} ${path}`, metadata);
      } else if (status >= 400) {
        logger.warning(`← ${status} ${ctx.request.method} ${path}`, metadata);
      } else {
        logger.info(`← ${status} ${ctx.request.method} ${path}`, metadata);
      }
    } catch (error) {
      const duration = performance.now() - start;

      httpContext.response.status = ctx.response.status ?? 500;
      httpContext.response.headers = new Headers(ctx.response.headers);
      httpContext.response.committed = true;
      const httpSnapshot = snapshotContext(httpContext, {
        requestId,
        durationMs: duration,
        include: metadataInclude,
      });

      logger.error(`← Error ${ctx.request.method} ${path}`, {
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
