/**
 * Redux middleware for logging actions and state changes
 */

import type { Middleware } from "redux";
import { defaultLogger } from "../logger";
import type { ReduxLoggerOptions } from "../interfaces/redux-logger-options.interface";

/**
 * Create a Redux middleware for logging actions and state changes
 * @param options Options for the middleware
 * @returns Redux middleware
 */
export function createReduxLoggerMiddleware(
  options: ReduxLoggerOptions = {}
): Middleware {
  const {
    logger = defaultLogger,
    level = "info",
    actionLevel = "info",
    errorLevel = "error",
    collapsed = false,
    duration = false,
    timestamp = true,
    stateTransformer = (state) => state,
    actionTransformer = (action) => action,
    predicate = () => true,
  } = options;

  return (store) => (next) => (action: unknown) => {
    if (
      typeof action !== "object" ||
      action === null ||
      !("type" in action) ||
      typeof (action as any).type !== "string"
    ) {
      return next(action);
    }

    // Skip logging if predicate returns false
    if (!predicate(store.getState, action)) {
      return next(action);
    }

    const startTime = Date.now();
    let prevState = {};

    try {
      // Get previous state
      prevState = stateTransformer(store.getState());
    } catch (e) {
      logger[errorLevel]("Error getting previous state", { error: e });
    }

    // Transform action for logging
    let formattedAction;
    try {
      formattedAction = actionTransformer(action);
    } catch (e) {
      logger[errorLevel]("Error transforming action for logging", { error: e });
      formattedAction = action;
    }

    // Log action
    const actionType = action?.type || "unknown";
    const logContext: Record<string, any> = {
      action: formattedAction,
    };

    if (timestamp) {
      logContext.timestamp = new Date().toISOString();
    }

    logger[actionLevel](`Action: ${actionType}`, logContext);

    // Call next with the action
    let result;
    try {
      result = next(action);
    } catch (e) {
      logger[errorLevel](`Error dispatching action: ${actionType}`, {
        action: formattedAction,
        error: e,
      });
      throw e;
    }

    // Calculate duration if requested
    if (duration) {
      logContext.duration = `${Date.now() - startTime}ms`;
    }

    // Get next state
    let nextState = {};
    try {
      nextState = stateTransformer(store.getState());
    } catch (e) {
      logger[errorLevel]("Error getting next state", { error: e });
    }

    // Log state change
    if (!collapsed) {
      logger[level](`State change: ${actionType}`, {
        prevState,
        action: formattedAction,
        nextState,
        ...logContext,
      });
    }

    return result;
  };
}
