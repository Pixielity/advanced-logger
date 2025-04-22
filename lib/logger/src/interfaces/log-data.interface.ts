/**
 * Log data interface
 */

export interface LogData {
  level: string;
  message: string;
  timestamp: string;
  prefix: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
}
