/**
 * Next.js logger options interface
 */

import type { NextRequest } from "next/server";
import type { Logger } from "../logger";

export interface NextLoggerOptions {
  logger?: Logger;
  level?: "info" | "debug";
  includeHeaders?: boolean;
  includeCookies?: boolean;
  excludePaths?: string[];
  customContext?: (req: NextRequest) => Record<string, any>;
}
