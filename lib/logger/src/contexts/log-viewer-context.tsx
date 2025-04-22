"use client";

/**
 * React context for providing a log viewer
 */

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { LogEntry } from "../interfaces/log-entry.interface";
import type { LogViewerResult } from "../interfaces/log-viewer-result.interface";
import type { LogViewerProviderProps } from "../interfaces/log-viewer-provider-props.interface";

// Create the context with a default value
const LogViewerContext = createContext<LogViewerResult>({
  logs: [],
  isLoading: false,
  clearLogs: async () => {},
  refreshLogs: async () => {},
});

/**
 * Provider component for the log viewer context
 */
export const LogViewerProvider: React.FC<LogViewerProviderProps> = ({
  transport,
  refreshInterval = 1000,
  children,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load logs initially and set up refresh interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchLogs = async () => {
      try {
        const fetchedLogs = await transport.getLogs();
        setLogs(fetchedLogs as LogEntry[]);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLogs();

    // Set up interval if specified
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchLogs, refreshInterval);
    }

    // Clean up interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transport, refreshInterval]);

  // Function to clear logs
  const clearLogs = async () => {
    try {
      await transport.clear?.();
      setLogs([]);
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  // Function to manually refresh logs
  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await transport.getLogs();
      setLogs(fetchedLogs as LogEntry[]);
    } catch (error) {
      console.error("Failed to refresh logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: LogViewerResult = {
    logs,
    isLoading,
    clearLogs,
    refreshLogs,
  };

  return (
    <LogViewerContext.Provider value={value}>
      {children}
    </LogViewerContext.Provider>
  );
};

/**
 * Hook to use the log viewer from context
 */
export function useLogViewerContext(): LogViewerResult {
  return useContext(LogViewerContext);
}
