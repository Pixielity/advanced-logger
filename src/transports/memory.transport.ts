/**
 * Memory transport - stores logs in memory
 */

import type { Transport } from "../interfaces/transport.interface";
import type { LogLevelType } from "../types/log-level.type";
import type { MemoryTransportOptions } from "../interfaces/memory-transport-options.interface";
import type { LogEntry } from "../interfaces/log-entry.interface";

export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxLogs: number;

  constructor(options: MemoryTransportOptions = {}) {
    this.maxLogs = options.maxLogs || 100;
  }

  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void {
    this.logs.push({
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      context,
    });

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Clear all logs from memory
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get all logs from memory
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}
