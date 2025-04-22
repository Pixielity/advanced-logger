/**
 * JSON formatter - outputs logs in JSON format for machine processing
 * Useful for log aggregation systems
 */

import type { LogData } from "../interfaces/log-data.interface";
import type { LogFormatter } from "../interfaces/log-formatter.interface";

export class JsonFormatter implements LogFormatter {
  format(logData: LogData): {
    message: string;
    metadata?: Record<string, any>;
  } {
    const { level, timestamp, prefix, message, metadata, context } = logData;

    // Create a log object with the basic info
    const logObject: Record<string, any> = {
      level: level,
      timestamp: timestamp,
      prefix: prefix,
      message: message,
    };

    // Add context if present
    if (context && Object.keys(context).length > 0) {
      logObject.context = context;
    }

    // Return the stringified log object as message and the original metadata separately
    return {
      message: JSON.stringify(logObject),
      metadata: metadata,
    };
  }
}

// Export a singleton instance
export const jsonFormatter = new JsonFormatter();
