"use client";

/**
 * React context for providing a logger instance
 */

import React from "react";
import { createContext, useContext } from "react";
import { type Logger, defaultLogger } from "../logger";
import type { LoggerProviderProps } from "../interfaces/logger-provider-props.interface";

// Create the context
const LoggerContext = createContext<Logger>(defaultLogger);

/**
 * Provider component for the logger context
 */
export const LoggerProvider: React.FC<LoggerProviderProps> = ({
  logger,
  children,
}) => {
  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
};

/**
 * Hook to use the logger from context
 */
export function useLoggerContext(): Logger {
  return useContext(LoggerContext);
}
