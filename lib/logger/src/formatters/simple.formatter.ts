/**
 * Simple formatter - outputs logs in a minimal format
 * Example: INFO: User logged in
 */

import type { LogData } from "../interfaces/log-data.interface";
import type { LogFormatter } from "../interfaces/log-formatter.interface";

export class SimpleFormatter implements LogFormatter {
  format(logData: LogData): {
    message: string;
    metadata?: Record<string, any>;
  } {
    const { level, message, metadata, context } = logData;

    let formattedMessage = `${level.toUpperCase()}: ${message}`;

    // Add context to the formatted message if present
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` (Context: ${JSON.stringify(context)})`;
    }

    // Return formatted message and metadata separately
    return {
      message: formattedMessage,
      metadata: metadata,
    };
  }
}

// Export a singleton instance
export const simpleFormatter = new SimpleFormatter();
