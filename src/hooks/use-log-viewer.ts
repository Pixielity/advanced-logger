"use client";

/**
 * Hook for viewing logs from a memory transport
 */

import { useEffect, useState } from "react";
import type { MemoryTransport } from "../transports/memory.transport";
import type { LogEntry } from "../interfaces/log-entry.interface";
import type { LogViewerResult } from "../interfaces/log-viewer-result.interface";

/**
 * Hook to view logs from a memory transport
 * @param transport The memory transport to view logs from
 * @param refreshInterval Optional interval in ms to refresh logs
 * @returns An object with logs and functions to manage them
 */
export function useLogViewer(
  transport: MemoryTransport,
  refreshInterval = 1000
): LogViewerResult {
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

  return {
    logs,
    isLoading,
    clearLogs,
    refreshLogs,
  };
}
