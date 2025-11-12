// adapters/express.ts
// Note: This would need Node.js compatibility layer
import { Logger } from "../core/logger.ts";
import {
  createContext as createHttpContext,
  snapshotContext,
  type ContextSnapshotIncludeOptions,
} from "../new/context.ts";

export interface ExpressLoggerOptions {
  logger?: Logger;
  skipPaths?: string[];
  httpMetadata?: ContextSnapshotIncludeOptions;
}

// deno-lint-ignore no-explicit-any
export function expressLogger(options: ExpressLoggerOptions = {}): (req: any, res: any, next: any) => void {
  const logger = options.logger || new Logger();
  const skipPaths = options.skipPaths || [];
  const metadataInclude = options.httpMetadata;

  return (req: any, res: any, next: any) => {
    const start = performance.now();
    const requestId = crypto.randomUUID();
    const path = req.path;

    // Skip if in skip list
    if (skipPaths.includes(path)) {
      next();
      return;
    }

    const httpContext = createHttpContext(
      new Request(buildRequestUrl(req), {
        method: req.method,
        headers: headersFromIncoming(req.headers ?? {}),
      }),
      normalizeParams(req.params),
    );
    if (req.ip) {
      httpContext.state.ip = req.ip;
    }
    const userAgent = req.get?.("user-agent");
    if (userAgent) {
      httpContext.state.userAgent = userAgent;
    }

    // Log incoming request
    logger.info(`→ ${req.method} ${path}`, {
      requestId,
      ip: req.ip,
      userAgent,
    });

    res.on("finish", () => {
      const duration = performance.now() - start;
      const status = res.statusCode ?? 200;

      httpContext.response.status = status;
      httpContext.response.statusText = res.statusMessage;
      httpContext.response.headers = headersFromOutgoing(res.getHeaders());
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
        logger.success(`← ${status} ${req.method} ${path}`, metadata);
      } else if (status >= 400) {
        logger.warning(`← ${status} ${req.method} ${path}`, metadata);
      } else {
        logger.info(`← ${status} ${req.method} ${path}`, metadata);
      }
    });

    next();
  };
}

// deno-lint-ignore no-explicit-any
function headersFromIncoming(headers: Record<string, any>): Headers {
  return headersFromRecord(headers);
}

// deno-lint-ignore no-explicit-any
function headersFromOutgoing(headers: Record<string, any>): Headers {
  return headersFromRecord(headers);
}

// deno-lint-ignore no-explicit-any
function headersFromRecord(headers: Record<string, any>): Headers {
  const result = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) {
          result.append(key, String(entry));
        }
      });
    } else if (value !== undefined) {
      result.set(key, String(value));
    }
  }
  return result;
}

// deno-lint-ignore no-explicit-any
function normalizeParams(params: Record<string, any> | undefined): Record<string, string> {
  if (!params) return {};
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      normalized[key] = String(value);
    }
  }
  return normalized;
}

// deno-lint-ignore no-explicit-any
function buildRequestUrl(req: any): string {
  const protocol = req.protocol ?? "http";
  const host = req.get?.("host") ?? req.headers?.host ?? "localhost";
  const originalUrl = req.originalUrl ?? req.url ?? "/";
  try {
    return new URL(originalUrl, `${protocol}://${host}`).toString();
  } catch {
    return `${protocol}://${host}${originalUrl}`;
  }
}
