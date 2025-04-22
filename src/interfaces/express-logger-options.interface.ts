/**
 * Express logger options interface
 */

import type { Request } from "express";
import type { Logger } from "../logger";

export interface ExpressLoggerOptions {
  logger?: Logger;
  level?: "info" | "debug";
  includeHeaders?: boolean;
  includeCookies?: boolean;
  includeBody?: boolean;
  excludePaths?: string[];
  customContext?: (req: Request) => Record<string, any>;
}
