/**
 * Console transport - sends logs to the console
 */

import type { Transport } from "../interfaces/transport.interface";
import type { LogLevelType } from "../types/log-level.type";
import { LogLevel } from "../enums/log-levels.enum";

export class ConsoleTransport implements Transport {
  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void {
    // Use standard console methods with metadata as a separate parameter
    const logData = context ? { ...metadata, context } : metadata;

    switch (level) {
      case LogLevel.INFO:
        if (logData) {
          console.info(message, logData);
        } else {
          console.info(message);
        }
        break;
      case LogLevel.WARN:
        if (logData) {
          console.warn(message, logData);
        } else {
          console.warn(message);
        }
        break;
      case LogLevel.ERROR:
        if (logData) {
          console.error(message, logData);
        } else {
          console.error(message);
        }
        break;
      case LogLevel.DEBUG:
        if (logData) {
          console.debug(message, logData);
        } else {
          console.debug(message);
        }
        break;
    }
  }
}
