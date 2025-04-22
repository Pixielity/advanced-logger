/**
 * Redux logger options interface
 */

import type { Logger } from "../logger";

export interface ReduxLoggerOptions {
  logger?: Logger;
  level?: "info" | "debug";
  actionLevel?: "info" | "debug";
  errorLevel?: "error" | "warn";
  collapsed?: boolean;
  duration?: boolean;
  timestamp?: boolean;
  stateTransformer?: (state: any) => any;
  actionTransformer?: (action: any) => any;
  predicate?: (getState: () => any, action: any) => boolean;
  colors?: {
    title?: string;
    prevState?: string;
    action?: string;
    nextState?: string;
    error?: string;
  };
}
