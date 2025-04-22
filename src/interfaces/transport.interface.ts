/**
 * Transport interface for sending logs to different destinations
 */

import type { LogLevelType } from "../types/log-level.type";

export interface Transport {
  /**
   * Log a message to this transport
   * @param level The log level
   * @param message The formatted message
   * @param metadata Optional metadata
   * @param context Optional context data
   */
  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void;

  /**
   * Clear all logs (if supported by the transport)
   */
  clear?(): void | Promise<void>;

  /**
   * Get all logs (if supported by the transport)
   */
  getLogs?():
    | Array<{
        level: LogLevelType;
        message: string;
        timestamp: string;
        metadata?: Record<string, any>;
        context?: Record<string, any>;
      }>
    | Promise<
        Array<{
          level: LogLevelType;
          message: string;
          timestamp: string;
          metadata?: Record<string, any>;
          context?: Record<string, any>;
        }>
      >;
}
