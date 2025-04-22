/**
 * Main entry point for the logger library
 */

// Export core
export { Logger, defaultLogger } from "./logger";

// Export global context functions
export {
  setGlobalContext,
  addToGlobalContext,
  removeFromGlobalContext,
  clearGlobalContext,
  getGlobalContext,
} from "./context";

// Export all modules
export * from "./context";
export * from "./manager";
export * from "./types";
export * from "./interfaces";
export * from "./enums";
export * from "./formatters";
export * from "./transports";
export * from "./utils";
export * from "./config";
export * from "./hooks";
export * from "./contexts";
export * from "./middlewares";
