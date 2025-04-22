/**
 * Express middleware for logging requests
 */

import type { Request, Response, NextFunction } from "express";
import { defaultLogger } from "../logger";
import type { ExpressLoggerOptions } from "../interfaces/express-logger-options.interface";

/**
 * Create an Express middleware for logging requests
 * @param options Options for the middleware
 * @returns Express middleware function
 */
export function createExpressLoggerMiddleware(
  options: ExpressLoggerOptions = {}
) {
  const {
    logger = defaultLogger,
    level = "info",
    includeHeaders = false,
    includeCookies = false,
    includeBody = false,
    excludePaths = [],
    customContext,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip excluded paths
    if (excludePaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const startTime = Date.now();

    // Create context for the request
    const context: Record<string, any> = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };

    // Add headers if requested
    if (includeHeaders) {
      context.headers = { ...req.headers };
      // Remove sensitive headers
      delete context.headers.authorization;
      delete context.headers.cookie;
    }

    // Add cookies if requested
    if (includeCookies && req.cookies) {
      context.cookies = { ...req.cookies };
    }

    // Add body if requested
    if (includeBody && req.body) {
      context.body = { ...req.body };
      // Remove sensitive fields
      delete context.body.password;
      delete context.body.token;
    }

    // Add custom context if provided
    if (customContext) {
      Object.assign(context, customContext(req));
    }

    // Log the request
    logger[level](`Request: ${req.method} ${req.originalUrl || req.url}`, {
      context,
    });

    // Capture the response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, callback?: any) {
      // Restore original end
      res.end = originalEnd;

      // Calculate request duration
      const duration = Date.now() - startTime;

      // Log the response
      logger[level](
        `Response: ${req.method} ${req.originalUrl || req.url} - ${
          res.statusCode
        }`,
        {
          context: {
            ...context,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
          },
        }
      );

      // Call the original end
      return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
  };
}
