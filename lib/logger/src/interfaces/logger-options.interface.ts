/**
 * Logger options interface
 */

import type { LogFormatter } from "./log-formatter.interface";
import type { Transport } from "./transport.interface";

export interface LoggerOptions {
  prefix?: string;
  formatter?: LogFormatter;
  transports?: Transport[];
  minLevel?: string;
  enableMetadata?: boolean;
  timestampFormat?: string;
}
