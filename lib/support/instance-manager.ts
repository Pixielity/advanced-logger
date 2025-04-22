/**
 * Instance Manager
 *
 * A class for managing multiple instances of a class with different configurations.
 * Inspired by Laravel's Manager pattern.
 */

type FactoryFunction<T, ConfigType> = (config: ConfigType) => T
type ResolverFunction<T, ConfigType> = (name: string, config: ConfigType) => T

export class InstanceManager<T, ConfigType = Record<string, any>> {
  private instances: Map<string, T> = new Map()
  private drivers: Map<string, FactoryFunction<T, ConfigType>> = new Map()
  private defaultConfig: ConfigType
  private defaultFactory: FactoryFunction<T, ConfigType>
  protected defaultDriver: string

  /**
   * Create a new instance manager
   */
  constructor(defaultDriver: string, defaultFactory: FactoryFunction<T, ConfigType>, defaultConfig: ConfigType) {
    this.defaultDriver = defaultDriver
    this.defaultFactory = defaultFactory
    this.defaultConfig = defaultConfig
  }

  /**
   * Get an instance by name, creating it if it doesn't exist
   */
  instance(name?: string, config?: Partial<ConfigType>): T {
    const driverName = name || this.defaultDriver
    const instanceKey = this.getInstanceKey(driverName, config)

    // Return cached instance if it exists
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey)!
    }

    // Create a new instance
    const instance = this.resolve(driverName, config)
    this.instances.set(instanceKey, instance)

    return instance
  }

  /**
   * Register a new driver
   */
  extend(name: string, factory: FactoryFunction<T, ConfigType>): this {
    this.drivers.set(name, factory)
    return this
  }

  /**
   * Set the default driver
   */
  setDefaultDriver(name: string): this {
    this.defaultDriver = name
    return this
  }

  /**
   * Get all registered driver names
   */
  getDrivers(): string[] {
    return Array.from(this.drivers.keys())
  }

  /**
   * Check if a driver is registered
   */
  hasDriver(name: string): boolean {
    return this.drivers.has(name)
  }

  /**
   * Clear all cached instances
   */
  clearInstances(): this {
    this.instances.clear()
    return this
  }

  /**
   * Resolve an instance by name and config
   */
  private resolve(name: string, config?: Partial<ConfigType>): T {
    const factory = this.drivers.get(name) || this.defaultFactory
    const mergedConfig = { ...this.defaultConfig, ...(config || {}) } as ConfigType

    return factory(mergedConfig)
  }

  /**
   * Generate a unique key for an instance based on name and config
   */
  private getInstanceKey(name: string, config?: Partial<ConfigType>): string {
    if (!config || Object.keys(config).length === 0) {
      return name
    }

    // Create a deterministic key from the config
    const configString = JSON.stringify(config, Object.keys(config).sort())
    return `${name}:${configString}`
  }
}
