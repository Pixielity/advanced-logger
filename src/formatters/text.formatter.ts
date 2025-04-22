/**
 * Text formatter - outputs logs in a standard text format
 * Example: [INFO] [App] 2023-04-22T09:55:11.000Z - User logged in
 */

import type { LogData } from "../interfaces/log-data.interface";
import type { LogFormatter } from "../interfaces/log-formatter.interface";

export class TextFormatter implements LogFormatter {
  format(logData: LogData): {
    message: string;
    metadata?: Record<string, any>;
  } {
    const { level, timestamp, prefix, message, metadata, context } = logData;

    let formattedMessage = `[${level.toUpperCase()}] [${prefix}] ${timestamp} - ${message}`;

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
export const textFormatter = new TextFormatter();
