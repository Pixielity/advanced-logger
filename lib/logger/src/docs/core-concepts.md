# Core Concepts

Advanced Logger is built around several key concepts that provide flexibility and power. Understanding these concepts will help you make the most of the library.

## Loggers

A `Logger` is the main class you'll interact with. It provides methods for logging messages at different levels (debug, info, warn, error) and manages the flow of log data through formatters and transports.

\`\`\`typescript
import { Logger } from 'advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
// other options
});
\`\`\`

## Log Levels

Advanced Logger supports four log levels, in order of increasing severity:

1. **debug** - Detailed information for debugging purposes
2. **info** - General information about application operation
3. **warn** - Warning conditions that don't prevent normal operation
4. **error** - Error conditions that might prevent normal operation

You can set a minimum log level to filter out less severe messages:

\`\`\`typescript
import { Logger, LogLevel } from 'advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
minLevel: LogLevel.WARN // Only warn and error messages will be logged
});
\`\`\`

## Transports

Transports are responsible for actually storing or displaying log messages. Advanced Logger comes with several built-in transports:

- **ConsoleTransport** - Logs to the console
- **MemoryTransport** - Stores logs in memory
- **LocalStorageTransport** - Stores logs in browser localStorage
- **IndexedDBTransport** - Stores logs in browser IndexedDB
- **HttpTransport** - Sends logs to a remote endpoint

You can use multiple transports with a single logger:

\`\`\`typescript
import { Logger, ConsoleTransport, MemoryTransport } from 'advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
transports: [
new ConsoleTransport(),
new MemoryTransport({ maxLogs: 100 })
]
});
\`\`\`

## Formatters

Formatters determine how log data is structured before being passed to transports. Advanced Logger includes several formatters:

- **textFormatter** - Simple text format
- **jsonFormatter** - JSON format for machine processing
- **prettyFormatter** - Human-readable format with emojis
- **simpleFormatter** - Minimal format

\`\`\`typescript
import { Logger, ConsoleTransport, prettyFormatter } from 'advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
formatter: prettyFormatter,
transports: [new ConsoleTransport()]
});
\`\`\`

## Context

Context allows you to attach additional data to your logs. This can be done globally or per-logger:

\`\`\`typescript
import { Logger, addToGlobalContext } from 'advanced-logger';

// Add global context that applies to all loggers
addToGlobalContext({ app: 'MyApp', environment: 'production' });

const logger = new Logger();

// Create a new logger with additional context
const userLogger = logger.withContext({ userId: '123', sessionId: 'abc' });

// All logs from userLogger will include both the global context and the user context
userLogger.info('User action');
\`\`\`

## LoggerManager

The `LoggerManager` provides a convenient way to create and manage multiple logger instances with different configurations:

\`\`\`typescript
import { loggerManager } from 'advanced-logger';

// Create different types of loggers
const consoleLogger = loggerManager.createConsoleDriver();
const memoryLogger = loggerManager.createMemoryDriver();
const httpLogger = loggerManager.createHttpDriver({
endpoint: 'https://logs.example.com/api'
});
\`\`\`

Understanding these core concepts will give you a solid foundation for using Advanced Logger effectively in your applications.
\`\`\`

Now, let's create the API reference index:
