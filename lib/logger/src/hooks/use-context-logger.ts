"use client";

/**
 * Hook for using a logger with component context
 */

import { useEffect } from "react";
import type { Logger } from "../logger";
import { useLogger } from "./use-logger";
import type { LoggerOptions } from "../interfaces/logger-options.interface";

/**
 * Hook to use a logger with component context
 * @param componentName The name of the component for context
 * @param additionalContext Additional context to add
 * @param options Logger options or a logger instance
 * @returns A logger instance with component context
 */
export function useContextLogger(
  componentName: string,
  additionalContext: Record<string, any> = {},
  options?: LoggerOptions | Logger
): Logger {
  const baseLogger = useLogger(options);

  // Create a logger with component context
  const contextLogger = baseLogger.withContext({
    component: componentName,
    ...additionalContext,
  });

  // Log component mount and unmount
  useEffect(() => {
    contextLogger.debug(`Component mounted: ${componentName}`);

    return () => {
      contextLogger.debug(`Component unmounted: ${componentName}`);
    };
  }, [componentName, contextLogger]);

  return contextLogger;
}
