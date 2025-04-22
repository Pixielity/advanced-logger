/**
 * Logger provider props interface
 */

import type { ReactNode } from "react";
import type { Logger } from "../logger";

export interface LoggerProviderProps {
  logger: Logger;
  children: ReactNode;
}
