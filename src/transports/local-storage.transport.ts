/**
 * LocalStorage transport - stores logs in browser's localStorage
 * Only works in browser environments
 */

import type { Transport } from "../interfaces/transport.interface";
import type { LogLevelType } from "../types/log-level.type";
import type { LocalStorageTransportOptions } from "../interfaces/local-storage-transport-options.interface";
import type { LogEntry } from "../interfaces/log-entry.interface";

export class LocalStorageTransport implements Transport {
  private key: string;
  private maxLogs: number;
  private isClient: boolean;

  constructor(options: LocalStorageTransportOptions = {}) {
    this.key = options.key || "app_logs";
    this.maxLogs = options.maxLogs || 100;
    this.isClient = typeof window !== "undefined";
  }

  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void {
    if (!this.isClient) return;

    try {
      // Get existing logs
      const existingLogsJson = localStorage.getItem(this.key) || "[]";
      const existingLogs = JSON.parse(existingLogsJson);

      // Add new log
      const newLog: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        metadata,
        context,
      };

      // Add to beginning for most recent first
      existingLogs.unshift(newLog);

      // Trim logs if needed
      if (existingLogs.length > this.maxLogs) {
        existingLogs.length = this.maxLogs;
      }

      // Save back to localStorage
      localStorage.setItem(this.key, JSON.stringify(existingLogs));
    } catch (error) {
      console.error("Failed to log to localStorage:", error);
    }
  }

  /**
   * Clear all logs from localStorage
   */
  clear(): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error("Failed to clear logs from localStorage:", error);
    }
  }

  /**
   * Get all logs from localStorage
   */
  getLogs(): LogEntry[] {
    if (!this.isClient) return [];

    try {
      const logsJson = localStorage.getItem(this.key) || "[]";
      return JSON.parse(logsJson);
    } catch (error) {
      console.error("Failed to retrieve logs from localStorage:", error);
      return [];
    }
  }
}
