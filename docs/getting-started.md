# Getting Started with Advanced Logger

This guide will help you get started with Advanced Logger in your project.

## Installation

Install the package using npm or yarn:

```bash
npm install @pixielity/advanced-logger

# or

yarn add @pixielity/advanced-logger
```

## Basic Setup

The simplest way to use Advanced Logger is to create a Logger instance with a ConsoleTransport:

```typescript
import { Logger, ConsoleTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
transports: [new ConsoleTransport()]
});

// Now you can log messages
logger.info('Application started');
logger.warn('Configuration issue detected', { config: 'database' });
logger.error('Failed to connect', { service: 'database', error: 'Connection refused' });
```

## Using the LoggerManager

For more advanced usage, you can use the LoggerManager to create and manage multiple logger instances:

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

## Next Steps

- Learn about [Core Concepts](./core-concepts.md)
- Explore the [API Reference](./api/README.md)
- Check out the [Guides](./guides/README.md) for common use cases
- See [Examples](./examples/README.md) for practical implementations

  ```

Let's create the core concepts document:
