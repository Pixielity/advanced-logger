/**
 * Log entry interface
 */

import type { LogLevelType } from "../types/log-level.type";

export interface LogEntry {
  id?: any;
  level: LogLevelType;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
}
