# Advanced Logger

A flexible and powerful logging library for JavaScript applications.

## Features

- Multiple log levels (debug, info, warn, error)
- Multiple transports (console, memory, localStorage, IndexedDB, HTTP)
- Customizable formatters
- Context-aware logging
- TypeScript support
- Works in browser and Node.js environments

## Installation

```bash
npm install @pixielity/advanced-logger
# or
yarn add @pixielity/advanced-logger
```

## Basic Usage

```typescript
import { Logger, ConsoleTransport, textFormatter } from '@pixielity/advanced-logger';

// Create a simple logger
const logger = new Logger({
  prefix: 'MyApp',
  formatter: textFormatter,
  transports: [new ConsoleTransport()]
});

// Log messages
logger.info('Application started');
logger.warn('Something might be wrong', { details: 'Check this out' });
logger.error('An error occurred', { error: new Error('Something failed') });
```

## Using the LoggerManager

```typescript
import { loggerManager } from '@pixielity/advanced-logger';

// Create a console logger
const consoleLogger = loggerManager.createConsoleDriver({
  prefix: 'MyApp'
});

// Create a logger that stores logs in localStorage
const storageLogger = loggerManager.createLocalStorageDriver({
  prefix: 'MyApp',
  key: 'app_logs',
  maxLogs: 100
});

// Log with different loggers
consoleLogger.info('This goes to console');
storageLogger.info('This goes to localStorage');
```

## Advanced Usage

### Context-aware logging

```typescript
import { Logger, ConsoleTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
  prefix: 'MyApp',
  transports: [new ConsoleTransport()]
});

// Create a logger with context
const userLogger = logger.withContext({
  userId: '123',
  sessionId: 'abc-xyz'
});

// All logs will include the context
userLogger.info('User action performed');
```

### Custom formatters

```typescript
import { LogFormatter, LogData, Logger, ConsoleTransport } from '@pixielity/advanced-logger';

// Create a custom formatter
class MyCustomFormatter implements LogFormatter {
  format(logData: LogData) {
    const { level, message, timestamp, prefix, metadata } = logData;
    return {
      message: `[${prefix}] ${level.toUpperCase()} at ${timestamp}: ${message}`,
      metadata
    };
  }
}

const logger = new Logger({
  prefix: 'MyApp',
  formatter: new MyCustomFormatter(),
  transports: [new ConsoleTransport()]
});
```
