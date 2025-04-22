/**
 * Logger Manager
 *
 * Manages multiple logger instances with different configurations.
 * Inspired by Laravel's Manager pattern.
 */

import { InstanceManager } from "./support";
import { Logger } from "./logger";
import type { LoggerOptions } from "./interfaces/logger-options.interface";
import { ConsoleTransport } from "./transports/console.transport";
import { MemoryTransport } from "./transports/memory.transport";
import { LocalStorageTransport } from "./transports/local-storage.transport";
import { HttpTransport } from "./transports/http.transport";
import { IndexedDBTransport } from "./transports/indexed-db.transport";
import { defaultConfig } from "./config/default.config";

// Default configuration for the logger
const DEFAULT_CONFIG: LoggerOptions = {
  prefix: defaultConfig.prefix,
  formatter: defaultConfig.formatter,
  minLevel: defaultConfig.minLevel,
  enableMetadata: defaultConfig.enableMetadata,
  timestampFormat: defaultConfig.timestampFormat,
  transports: [new ConsoleTransport()],
};

export class LoggerManager extends InstanceManager<Logger, LoggerOptions> {
  private stacks: Map<string, string[]> = new Map();
  private transporters: Map<string, any> = new Map();
  private defaultInstance = "default";

  constructor() {
    // Create the default factory function
    const defaultFactory = (config: LoggerOptions) => new Logger(config);

    super("console", defaultFactory, DEFAULT_CONFIG);

    // Register built-in drivers
    this.registerBuiltInDrivers();
  }

  /**
   * Get a logger instance by driver name
   */
  driver(name: string | null = null): Logger {
    return this.instance(name || this.defaultDriver);
  }

  /**
   * Get a logger instance by stack name
   */
  stack(name: string | null = null): Logger {
    const stackName = name || "default";

    if (!this.stacks.has(stackName)) {
      throw new Error(`Logger stack [${stackName}] is not defined.`);
    }

    // Get the drivers in this stack
    const drivers = this.stacks.get(stackName)!;

    // Create a logger with the first driver
    const logger = this.driver(drivers[0]);

    // Add additional transports from other drivers in the stack
    for (let i = 1; i < drivers.length; i++) {
      const driverConfig = this.getInstanceConfig(drivers[i]);
      if (driverConfig.transports) {
        for (const transport of driverConfig.transports) {
          logger.addTransport(transport);
        }
      }
    }

    return logger;
  }

  /**
   * Get a transporter by name
   */
  transporter(name: string | null = null): any {
    const transportName = name || "console";

    if (!this.transporters.has(transportName)) {
      throw new Error(`Transporter [${transportName}] is not defined.`);
    }

    return this.transporters.get(transportName);
  }

  /**
   * Create a driver with the given name and config
   */
  createDriver(name: string, config: LoggerOptions): Logger {
    return this.instance(name, config);
  }

  /**
   * Create a console driver
   */
  createConsoleDriver(config: Partial<LoggerOptions> = {}): Logger {
    const consoleConfig: LoggerOptions = {
      ...DEFAULT_CONFIG,
      ...config,
      transports: [new ConsoleTransport()],
    };

    return this.createDriver("console", consoleConfig);
  }

  /**
   * Create a localStorage driver
   */
  createLocalStorageDriver(
    config: Partial<LoggerOptions> & { key?: string; maxLogs?: number } = {}
  ): Logger {
    const { key, maxLogs, ...restConfig } = config;

    const localStorageConfig: LoggerOptions = {
      ...DEFAULT_CONFIG,
      ...restConfig,
      transports: [
        new ConsoleTransport(),
        new LocalStorageTransport({ key, maxLogs }),
      ],
    };

    return this.createDriver("localStorage", localStorageConfig);
  }

  /**
   * Create a memory driver
   */
  createMemoryDriver(
    config: Partial<LoggerOptions> & { maxLogs?: number } = {}
  ): Logger {
    const { maxLogs, ...restConfig } = config;

    const memoryConfig: LoggerOptions = {
      ...DEFAULT_CONFIG,
      ...restConfig,
      transports: [new ConsoleTransport(), new MemoryTransport({ maxLogs })],
    };

    return this.createDriver("memory", memoryConfig);
  }

  /**
   * Create an IndexedDB driver
   */
  createIndexedDBDriver(
    config: Partial<LoggerOptions> & {
      databaseName?: string;
      maxLogs?: number;
    } = {}
  ): Logger {
    const { databaseName, maxLogs, ...restConfig } = config;

    const indexedDBConfig: LoggerOptions = {
      ...DEFAULT_CONFIG,
      ...restConfig,
      transports: [
        new ConsoleTransport(),
        new IndexedDBTransport({ databaseName, maxLogs }),
      ],
    };

    return this.createDriver("indexedDB", indexedDBConfig);
  }

  /**
   * Create an HTTP driver
   */
  createHttpDriver(
    config: Partial<LoggerOptions> & {
      endpoint: string;
      headers?: Record<string, string>;
      batchSize?: number;
      batchInterval?: number;
    }
  ): Logger {
    const { endpoint, headers, batchSize, batchInterval, ...restConfig } =
      config;

    const httpConfig: LoggerOptions = {
      ...DEFAULT_CONFIG,
      ...restConfig,
      transports: [
        new ConsoleTransport(),
        new HttpTransport({ endpoint, headers, batchSize, batchInterval }),
      ],
    };

    return this.createDriver("http", httpConfig);
  }

  /**
   * Create a stack of loggers
   */
  createStack(name: string, drivers: string[]): this {
    this.stacks.set(name, drivers);
    return this;
  }

  /**
   * Register a transporter
   */
  registerTransporter(name: string, transporter: any): this {
    this.transporters.set(name, transporter);
    return this;
  }

  /**
   * Get the default instance name
   */
  getDefaultInstance(): string {
    return this.defaultInstance;
  }

  /**
   * Set the default instance name
   */
  setDefaultInstance(name: string): this {
    this.defaultInstance = name;
    return this;
  }

  /**
   * Get the configuration for a specific instance
   */
  getInstanceConfig(name: string): LoggerOptions {
    // This is a simplified implementation
    // In a real-world scenario, you might want to store configurations separately
    return {
      ...DEFAULT_CONFIG,
    };
  }

  /**
   * Register all the built-in drivers
   */
  private registerBuiltInDrivers(): void {
    // Console driver
    this.extend("console", (config) => {
      return new Logger({
        ...config,
        transports: [new ConsoleTransport()],
      });
    });

    // Memory driver
    this.extend("memory", (config) => {
      const { maxLogs = 100 } = config as any;
      return new Logger({
        ...config,
        transports: [new MemoryTransport({ maxLogs })],
      });
    });

    // LocalStorage driver
    this.extend("localStorage", (config) => {
      const { key = "app_logs", maxLogs = 100 } = config as any;
      return new Logger({
        ...config,
        transports: [new LocalStorageTransport({ key, maxLogs })],
      });
    });

    // IndexedDB driver
    this.extend("indexedDB", (config) => {
      const { databaseName = "app_logs", maxLogs = 1000 } = config as any;
      return new Logger({
        ...config,
        transports: [new IndexedDBTransport({ databaseName, maxLogs })],
      });
    });

    // HTTP driver
    this.extend("http", (config) => {
      const { endpoint, headers, batchSize, batchInterval } = config as any;
      if (!endpoint) {
        throw new Error("HTTP driver requires an endpoint");
      }
      return new Logger({
        ...config,
        transports: [
          new HttpTransport({ endpoint, headers, batchSize, batchInterval }),
        ],
      });
    });

    // Register default transporters
    this.registerTransporter("console", new ConsoleTransport());
    this.registerTransporter("memory", new MemoryTransport());
    this.registerTransporter("localStorage", new LocalStorageTransport());
    this.registerTransporter("indexedDB", new IndexedDBTransport());
  }
}

// Create a singleton instance
export const loggerManager = new LoggerManager();
