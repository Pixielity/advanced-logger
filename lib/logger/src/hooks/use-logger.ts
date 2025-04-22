"use client";

/**
 * Hook for using the logger in React components
 */

import { useEffect, useState } from "react";
import { Logger, defaultLogger } from "../logger";
import type { LoggerOptions } from "../interfaces/logger-options.interface";

/**
 * Hook to use a logger instance in a React component
 * @param options Logger options or a logger instance
 * @returns A logger instance
 */
export function useLogger(options?: LoggerOptions | Logger): Logger {
  const [logger, setLogger] = useState<Logger>(() => {
    if (options instanceof Logger) {
      return options;
    }
    return options ? new Logger(options) : defaultLogger;
  });

  // Update logger if options change
  useEffect(() => {
    if (!(options instanceof Logger) && options) {
      setLogger(new Logger(options));
    }
  }, [options]);

  return logger;
}
