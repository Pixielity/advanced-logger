# API Reference

This section provides detailed documentation for all the classes, interfaces, and functions in Advanced Logger.

## Core Classes

- [Logger](./logger.md) - The main logger class
- [LoggerManager](./logger-manager.md) - Manager for creating and handling multiple logger instances
- [GlobalContext](./global-context.md) - Manages global context data

## Transports

- [ConsoleTransport](./transports/console-transport.md) - Logs to the console
- [MemoryTransport](./transports/memory-transport.md) - Stores logs in memory
- [LocalStorageTransport](./transports/local-storage-transport.md) - Stores logs in browser localStorage
- [IndexedDBTransport](./transports/indexed-db-transport.md) - Stores logs in browser IndexedDB
- [HttpTransport](./transports/http-transport.md) - Sends logs to a remote endpoint

## Formatters

- [TextFormatter](./formatters/text-formatter.md) - Simple text format
- [JsonFormatter](./formatters/json-formatter.md) - JSON format for machine processing
- [PrettyFormatter](./formatters/pretty-formatter.md) - Human-readable format with emojis
- [SimpleFormatter](./formatters/simple-formatter.md) - Minimal format

## Interfaces

- [LogFormatter](./interfaces/log-formatter.md) - Interface for creating custom formatters
- [Transport](./interfaces/transport.md) - Interface for creating custom transports
- [LoggerOptions](./interfaces/logger-options.md) - Options for configuring a logger
- [LogData](./interfaces/log-data.md) - Structure of log data

## Enums

- [LogLevel](./enums/log-level.md) - Log level constants
- [LogFormat](./enums/log-format.md) - Log format constants

## Utility Functions

- [Context Functions](./utils/context-functions.md) - Functions for managing global context
- [Time Utilities](./utils/time-utilities.md) - Functions for formatting timestamps
  \`\`\`

Let's create the Logger API documentation:
