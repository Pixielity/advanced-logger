/**
 * Pretty formatter - outputs logs in a human-readable format
 */

import type { LogData } from "../interfaces/log-data.interface";
import type { LogFormatter } from "../interfaces/log-formatter.interface";
import { LogEmoji } from "../enums/log-emojis.enum";

export class PrettyFormatter implements LogFormatter {
  format(logData: LogData): {
    message: string;
    metadata?: Record<string, any>;
  } {
    const { level, timestamp, prefix, message, metadata, context } = logData;

    // Format the timestamp to be more readable
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString();

    // Get the appropriate emoji for the log level
    const emoji = LogEmoji[level.toUpperCase() as keyof typeof LogEmoji] || " ";

    // Build the message
    let formattedMessage = `${emoji} ${formattedTime} [${level.toUpperCase()}] [${prefix}] ${message}`;

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
export const prettyFormatter = new PrettyFormatter();
