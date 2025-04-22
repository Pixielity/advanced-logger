/**
 * Log viewer result interface
 */

import type { LogEntry } from "./log-entry.interface";

export interface LogViewerResult {
  logs: LogEntry[];
  isLoading: boolean;
  clearLogs: () => Promise<void>;
  refreshLogs: () => Promise<void>;
}
