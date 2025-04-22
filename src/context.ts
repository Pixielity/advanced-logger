/**
 * GlobalContext class
 *
 * Manages global context data that can be applied to all loggers.
 * Implemented as a singleton to ensure there's only one instance.
 */

export class GlobalContext {
  private static instance: GlobalContext;
  private contextData: Record<string, any> = {};

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): GlobalContext {
    if (!GlobalContext.instance) {
      GlobalContext.instance = new GlobalContext();
    }
    return GlobalContext.instance;
  }

  /**
   * Set the global context (replaces existing context)
   * @param context The context data to set
   */
  public set(context: Record<string, any>): void {
    this.contextData = { ...context };
  }

  /**
   * Add data to the global context
   * @param context The context data to add
   */
  public add(context: Record<string, any>): void {
    this.contextData = {
      ...this.contextData,
      ...context,
    };
  }

  /**
   * Remove specific keys from the global context
   * @param keys The keys to remove
   */
  public remove(keys: string[]): void {
    for (const key of keys) {
      delete this.contextData[key];
    }
  }

  /**
   * Clear all global context data
   */
  public clear(): void {
    this.contextData = {};
  }

  /**
   * Get the current global context data
   * @returns A copy of the current context data
   */
  public get(): Record<string, any> {
    return { ...this.contextData };
  }

  /**
   * Check if the global context has a specific key
   * @param key The key to check
   * @returns True if the key exists in the context
   */
  public has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.contextData, key);
  }

  /**
   * Get a specific value from the global context
   * @param key The key to get
   * @returns The value for the key, or undefined if not found
   */
  public getValue(key: string): any {
    return this.contextData[key];
  }
}

// Export a singleton instance
export const globalContext = GlobalContext.getInstance();

// Export convenience functions
export function setGlobalContext(context: Record<string, any>): void {
  globalContext.set(context);
}

export function addToGlobalContext(context: Record<string, any>): void {
  globalContext.add(context);
}

export function removeFromGlobalContext(keys: string[]): void {
  globalContext.remove(keys);
}

export function clearGlobalContext(): void {
  globalContext.clear();
}

export function getGlobalContext(): Record<string, any> {
  return globalContext.get();
}
