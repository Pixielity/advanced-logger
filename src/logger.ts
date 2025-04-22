/**
 * Main Logger class implementation
 */

import type { LogFormatter } from "./interfaces/log-formatter.interface";
import type { LoggerOptions } from "./interfaces/logger-options.interface";
import type { Transport } from "./interfaces/transport.interface";
import type { LogLevelType } from "./types/log-level.type";
import type { LogData } from "./interfaces/log-data.interface";
import { LogLevel } from "./enums/log-levels.enum";
import { ConsoleTransport } from "./transports/console.transport";
import { textFormatter } from "./formatters/text.formatter";
import { globalContext } from "./context";

export class Logger {
  private prefix: string;
  private formatter: LogFormatter;
  private transports: Transport[];
  private context: Record<string, any> = {};
  private minLevel: LogLevelType;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || "App";
    this.formatter = options.formatter || textFormatter;
    this.transports = options.transports || [new ConsoleTransport()];
    this.minLevel = (options.minLevel as LogLevelType) || LogLevel.INFO;
  }

  /**
   * Set the formatter for this logger instance
   */
  setFormatter(formatter: LogFormatter): Logger {
    this.formatter = formatter;
    return this;
  }

  /**
   * Add a transport to this logger
   */
  addTransport(transport: Transport): Logger {
    this.transports.push(transport);
    return this;
  }

  /**
   * Remove all transports
   */
  clearTransports(): Logger {
    this.transports = [];
    return this;
  }

  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevelType): Logger {
    this.minLevel = level;
    return this;
  }

  /**
   * Check if a log level should be processed
   */
  private shouldLog(level: LogLevelType): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ];
    const minLevelIndex = levels.indexOf(this.minLevel as LogLevel);
    const currentLevelIndex = levels.indexOf(level as LogLevel);

    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Create log data object
   */
  private createLogData(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>
  ): LogData {
    // Merge global context and instance context
    const mergedContext = {
      ...globalContext.get(),
      ...this.context,
    };

    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      prefix: this.prefix,
      metadata,
      context:
        Object.keys(mergedContext).length > 0 ? mergedContext : undefined,
    };
  }

  /**
   * Log a message with the specified level
   */
  private log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>
  ): void {
    // Skip logging if below minimum level
    if (!this.shouldLog(level)) {
      return;
    }

    const logData = this.createLogData(level, message, metadata);
    const formatted = this.formatter.format(logData);

    // Send to all transports
    for (const transport of this.transports) {
      transport.log(
        level,
        formatted.message,
        formatted.metadata,
        logData.context
      );
    }
  }

  /**
   * Add context data to the logger
   * @param context The context data to add
   * @returns A new logger instance with the context added
   */
  withContext(context: Record<string, any>): Logger {
    const newLogger = new Logger({
      prefix: this.prefix,
      formatter: this.formatter,
      transports: this.transports,
      minLevel: this.minLevel,
    });

    // Copy existing context and add new context
    newLogger.context = {
      ...this.context,
      ...context,
    };

    return newLogger;
  }

  /**
   * Remove specific context keys from the logger
   * @param keys The context keys to remove
   * @returns A new logger instance with the specified context keys removed
   */
  withoutContext(keys: string[]): Logger {
    const newLogger = new Logger({
      prefix: this.prefix,
      formatter: this.formatter,
      transports: this.transports,
      minLevel: this.minLevel,
    });

    // Copy existing context
    newLogger.context = { ...this.context };

    // Remove specified keys
    for (const key of keys) {
      delete newLogger.context[key];
    }

    return newLogger;
  }

  /**
   * Log an informational message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log an error message
   */
  error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Log a debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Create a new logger instance with custom options
   */
  createLogger(options: LoggerOptions): Logger {
    return new Logger(options);
  }
}

// Create a default logger instance
export const defaultLogger = new Logger();
