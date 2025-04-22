/**
 * Log viewer provider props interface
 */

import type { ReactNode } from "react";
import type { MemoryTransport } from "../transports/memory.transport";

export interface LogViewerProviderProps {
  transport: MemoryTransport;
  refreshInterval?: number;
  children: ReactNode;
}
