# Logger

The `Logger` class is the core of the Advanced Logger library. It provides methods for logging messages at different levels and manages the flow of log data through formatters and transports.

## Import

```typescript
import { Logger } from '@pixielity/advanced-logger';
```

## Constructor

```typescript
constructor(options: LoggerOptions = {})
```

Creates a new Logger instance with the specified options.

### Parameters

- `options` (optional): Configuration options for the logger
  - `prefix`: String prefix for log messages (default: "App")
  - `formatter`: Formatter to use (default: textFormatter)
  - `transports`: Array of transports to use (default: [new ConsoleTransport()])
  - `minLevel`: Minimum log level to process (default: "info")
  - `enableMetadata`: Whether to include metadata in logs (default: true)
  - `timestampFormat`: Format for timestamps (default: "ISO")

### Example

```typescript
import { Logger, ConsoleTransport, textFormatter, LogLevel } from '@pixielity/advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
formatter: textFormatter,
transports: [new ConsoleTransport()],
minLevel: LogLevel.INFO,
enableMetadata: true,
timestampFormat: 'ISO'
});
```

## Methods

### Log Methods

#### info(message: string, metadata?: Record<string, any>): void

Logs an informational message.

```typescript
logger.info('Application started', { version: '1.0.0' });
```

#### warn(message: string, metadata?: Record<string, any>): void

Logs a warning message.

```typescript
logger.warn('Deprecated feature used', { feature: 'oldAPI' });
```

#### error(message: string, metadata?: Record<string, any>): void

Logs an error message.

```typescript
logger.error('Failed to connect to database', { error: err.message });
```

#### debug(message: string, metadata?: Record<string, any>): void

Logs a debug message.

```typescript
logger.debug('Processing item', { itemId: '123', state: 'pending' });
```

### Configuration Methods

#### setFormatter(formatter: LogFormatter): Logger

Sets the formatter for this logger instance.

```typescript
import { jsonFormatter } from '@pixielity/advanced-logger';

logger.setFormatter(jsonFormatter);
```

#### addTransport(transport: Transport): Logger

Adds a transport to this logger.

```typescript
import { MemoryTransport } from '@pixielity/advanced-logger';

logger.addTransport(new MemoryTransport({ maxLogs: 100 }));
```

#### clearTransports(): Logger

Removes all transports from this logger.

```typescript
logger.clearTransports();
```

#### setMinLevel(level: LogLevelType): Logger

Sets the minimum log level.

```typescript
import { LogLevel } from '@pixielity/advanced-logger';

logger.setMinLevel(LogLevel.WARN);
```

### Context Methods

#### withContext(context: Record<string, any>): Logger

Creates a new logger with the specified context added.

```typescript
const userLogger = logger.withContext({
userId: '123',
sessionId: 'abc-xyz'
});

userLogger.info('User logged in'); // Will include the context
```

#### withoutContext(keys: string[]): Logger

Creates a new logger with the specified context keys removed.

```typescript
const reducedLogger = userLogger.withoutContext(['sessionId']);

reducedLogger.info('User action'); // Will include userId but not sessionId
```

### Other Methods

#### createLogger(options: LoggerOptions): Logger

Creates a new logger instance with custom options.

```typescript
const newLogger = logger.createLogger({
prefix: 'AnotherApp',
minLevel: LogLevel.DEBUG
});
```

## Default Instance

The library exports a default logger instance that you can use without creating your own:

```typescript
import { defaultLogger } from '@pixielity/advanced-logger';

defaultLogger.info('Using the default logger');
