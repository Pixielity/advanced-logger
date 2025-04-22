/**
 * Next.js middleware for logging requests
 */

import { NextResponse, type NextRequest } from "next/server";
import { defaultLogger } from "../logger";
import type { NextLoggerOptions } from "../interfaces/next-logger-options.interface";

/**
 * Create a Next.js middleware for logging requests
 * @param options Options for the middleware
 * @returns Next.js middleware function
 */
export function createNextLoggerMiddleware(options: NextLoggerOptions = {}) {
  const {
    logger = defaultLogger,
    level = "info",
    includeHeaders = false,
    includeCookies = false,
    excludePaths = [],
    customContext,
  } = options;

  return async (req: NextRequest) => {
    // Skip excluded paths
    if (excludePaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
      return;
    }

    const startTime = Date.now();

    // Create context for the request
    const context: Record<string, any> = {
      method: req.method,
      url: req.nextUrl.toString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    };

    // Add headers if requested
    if (includeHeaders) {
      const headers: Record<string, string> = {};
      req.headers.forEach((value, key) => {
        // Skip sensitive headers
        if (key !== "authorization" && key !== "cookie") {
          headers[key] = value;
        }
      });
      context.headers = headers;
    }

    // Add cookies if requested
    if (includeCookies) {
      const cookies: Record<string, string> = {};
      req.cookies.getAll().forEach((cookie) => {
        cookies[cookie.name] = cookie.value;
      });
      context.cookies = cookies;
    }

    // Add custom context if provided
    if (customContext) {
      Object.assign(context, customContext(req));
    }

    // Log the request
    logger[level](`Request: ${req.method} ${req.nextUrl.pathname}`, {
      context,
    });

    // Process the request
    const response = await NextResponse.next();

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Log the response
    logger[level](
      `Response: ${req.method} ${req.nextUrl.pathname} - ${response.status}`,
      {
        context: {
          ...context,
          statusCode: response.status,
          duration: `${duration}ms`,
        },
      }
    );

    return response;
  };
}
