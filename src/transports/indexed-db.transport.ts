/**
 * IndexedDB transport - stores logs in browser's IndexedDB using Dexie.js
 * Only works in browser environments
 */

import type { Transport } from "../interfaces/transport.interface";
import type { LogLevelType } from "../types/log-level.type";
import Dexie from "dexie";
import type { LogEntry } from "../interfaces/log-entry.interface";
import type { IndexedDBTransportOptions } from "../interfaces/indexed-db-transport-options.interface";

class LogDatabase extends Dexie {
  logs: Dexie.Table<LogEntry, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      logs: "++id, level, timestamp",
    });
    this.logs = this.table("logs");
  }
}

export class IndexedDBTransport implements Transport {
  private db!: LogDatabase;
  private isClient: boolean;
  private maxLogs: number;
  private initialized = false;
  private queue: LogEntry[] = [];

  constructor(options: IndexedDBTransportOptions = {}) {
    this.isClient = typeof window !== "undefined";
    this.maxLogs = options.maxLogs || 10000;

    if (this.isClient) {
      this.db = new LogDatabase(options.databaseName || "app_logs");
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    if (!this.isClient) return;

    try {
      await this.db.open();
      this.initialized = true;

      // Process any queued logs
      if (this.queue.length > 0) {
        const queueCopy = [...this.queue];
        this.queue = [];
        for (const log of queueCopy) {
          await this.addLog(log);
        }
      }

      // Trim logs if needed
      await this.trimLogs();
    } catch (error) {
      console.error("Failed to initialize IndexedDB transport:", error);
    }
  }

  private async addLog(logEntry: LogEntry): Promise<void> {
    if (!this.isClient) return;

    if (!this.initialized) {
      this.queue.push(logEntry);
      return;
    }

    try {
      await this.db.logs.add(logEntry);
    } catch (error) {
      console.error("Failed to add log to IndexedDB:", error);
    }
  }

  private async trimLogs(): Promise<void> {
    if (!this.isClient || !this.initialized) return;

    try {
      const count = await this.db.logs.count();
      if (count > this.maxLogs) {
        // Get the IDs of the oldest logs that exceed our limit
        const oldestLogs = await this.db.logs
          .orderBy("timestamp")
          .limit(count - this.maxLogs)
          .toArray();

        const oldestIds = oldestLogs
          .map((log) => log.id)
          .filter((id) => id !== undefined) as number[];

        // Delete the oldest logs
        await this.db.logs.bulkDelete(oldestIds);
      }
    } catch (error) {
      console.error("Failed to trim logs in IndexedDB:", error);
    }
  }

  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void {
    if (!this.isClient) return;

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata: metadata || undefined,
      context: context || undefined,
    };

    this.addLog(logEntry);
    this.trimLogs();
  }

  /**
   * Clear all logs from IndexedDB
   */
  async clear(): Promise<void> {
    if (!this.isClient || !this.initialized) return;

    try {
      await this.db.logs.clear();
    } catch (error) {
      console.error("Failed to clear logs from IndexedDB:", error);
    }
  }

  /**
   * Get all logs from IndexedDB
   */
  async getLogs(
    options: {
      limit?: number;
      level?: LogLevelType;
      fromDate?: Date;
      toDate?: Date;
    } = {}
  ): Promise<LogEntry[]> {
    if (!this.isClient || !this.initialized) return [];

    try {
      let query = this.db.logs.orderBy("timestamp");

      // Apply level filter if specified
      if (options.level) {
        query = query.filter((log) => log.level === options.level);
      }

      // Apply date range filters if specified
      if (options.fromDate) {
        const fromTimestamp = options.fromDate.toISOString();
        query = query.filter((log) => log.timestamp >= fromTimestamp);
      }

      if (options.toDate) {
        const toTimestamp = options.toDate.toISOString();
        query = query.filter((log) => log.timestamp <= toTimestamp);
      }

      // Apply limit if specified
      if (options.limit) {
        query = query.limit(options.limit);
      }

      return await query.reverse().toArray();
    } catch (error) {
      console.error("Failed to retrieve logs from IndexedDB:", error);
      return [];
    }
  }

  /**
   * Get logs by level
   */
  async getLogsByLevel(level: LogLevelType): Promise<LogEntry[]> {
    return this.getLogs({ level });
  }

  /**
   * Get the most recent logs
   */
  async getRecentLogs(count = 10): Promise<LogEntry[]> {
    return this.getLogs({ limit: count });
  }
}
