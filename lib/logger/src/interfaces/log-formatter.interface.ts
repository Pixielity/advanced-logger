/**
 * Log formatter interface
 */

import type { LogData } from "./log-data.interface";

export interface LogFormatter {
  /**
   * Format a log entry
   * @param logData The log data to format
   * @returns An object containing the formatted message and optional metadata
   */
  format(logData: LogData): {
    message: string;
    metadata?: Record<string, any>;
  };
}
