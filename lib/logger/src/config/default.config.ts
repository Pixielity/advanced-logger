/**
 * Default logger configuration
 */

import { LogFormat } from "../enums/log-formats.enum";
import { textFormatter } from "../formatters/text.formatter";

export const defaultConfig = {
  prefix: "App",
  formatter: textFormatter,
  defaultFormat: LogFormat.TEXT,
  minLevel: "info",
  enableMetadata: true,
  timestampFormat: "ISO", // ISO, LOCALE, or UNIX
};
