# LoggerManager

The `LoggerManager` class provides a convenient way to create and manage multiple logger instances with different configurations. It follows a factory pattern inspired by Laravel's Manager pattern.

## Import

```typescript
import { loggerManager } from '@pixielity/advanced-logger';
```

## Methods

### Driver Methods

#### driver(name: string | null = null): Logger

Gets a logger instance by driver name.

```typescript
const consoleLogger = loggerManager.driver('console');
```

#### stack(name: string | null = null): Logger

Gets a logger instance by stack name.

```typescript
// First, create a stack
loggerManager.createStack('app', ['console', 'memory']);

// Then get the logger for that stack
const appLogger = loggerManager.stack('app');
```

#### transporter(name: string | null = null): any

Gets a transporter by name.

```typescript
const consoleTransporter = loggerManager.transporter('console');
```

### Creation Methods

#### createDriver(name: string, config: LoggerOptions): Logger

Creates a driver with the given name and config.

```typescript
const customLogger = loggerManager.createDriver('custom', {
prefix: 'Custom',
minLevel: 'debug'
});
```

#### createConsoleDriver(config: Partial<LoggerOptions> = {}): Logger

Creates a console driver.

```typescript
const consoleLogger = loggerManager.createConsoleDriver({
prefix: 'Console'
});
```

#### createLocalStorageDriver(config: Partial<LoggerOptions> & { key?: string; maxLogs?: number } = {}): Logger

Creates a localStorage driver.

```typescript
const storageLogger = loggerManager.createLocalStorageDriver({
prefix: 'Storage',
key: 'app_logs',
maxLogs: 100
});
```

#### createMemoryDriver(config: Partial<LoggerOptions> & { maxLogs?: number } = {}): Logger

Creates a memory driver.

```typescript
const memoryLogger = loggerManager.createMemoryDriver({
prefix: 'Memory',
maxLogs: 50
});
```

#### createIndexedDBDriver(config: Partial<LoggerOptions> & { databaseName?: string; maxLogs?: number } = {}): Logger

Creates an IndexedDB driver.

```typescript
const dbLogger = loggerManager.createIndexedDBDriver({
prefix: 'DB',
databaseName: 'app_logs',
maxLogs: 1000
});
```

#### createHttpDriver(config: Partial<LoggerOptions> & { endpoint: string; headers?: Record<string, string>; batchSize?: number; batchInterval?: number }): Logger

Creates an HTTP driver.

```typescript
const httpLogger = loggerManager.createHttpDriver({
prefix: 'API',
endpoint: 'https://logs.example.com/api',
headers: { 'Authorization': 'Bearer token' },
batchSize: 10,
batchInterval: 5000
});
```

### Stack Methods

#### createStack(name: string, drivers: string[]): this

Creates a stack of loggers.

```typescript
loggerManager.createStack('app', ['console', 'memory']);
```

### Transporter Methods

#### registerTransporter(name: string, transporter: any): this

Registers a transporter.

```typescript
import { ConsoleTransport } from '@pixielity/advanced-logger';

loggerManager.registerTransporter('custom-console', new ConsoleTransport());
```

### Configuration Methods

#### getDefaultInstance(): string

Gets the default instance name.

```typescript
const defaultName = loggerManager.getDefaultInstance();
```

#### setDefaultInstance(name: string): this

Sets the default instance name.

```typescript
loggerManager.setDefaultInstance('memory');
```

#### getInstanceConfig(name: string): LoggerOptions

Gets the configuration for a specific instance.

```typescript
const config = loggerManager.getInstanceConfig('console');
```

## Example Usage

```typescript
import { loggerManager } from '@pixielity/advanced-logger';

// Create different types of loggers
const consoleLogger = loggerManager.createConsoleDriver({
prefix: 'Console'
});

const memoryLogger = loggerManager.createMemoryDriver({
prefix: 'Memory',
maxLogs: 100
});

// Create a stack that logs to both console and memory
loggerManager.createStack('app', ['console', 'memory']);
const appLogger = loggerManager.stack('app');

// Log with different loggers
consoleLogger.info('This goes to console only');
memoryLogger.info('This goes to memory only');
appLogger.info('This goes to both console and memory');
