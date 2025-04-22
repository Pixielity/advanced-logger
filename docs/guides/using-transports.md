# Using Transports

Transports are a key feature of Advanced Logger that determine where your log messages are sent. This guide explains how to use the built-in transports and how to create custom transports.

## Built-in Transports

Advanced Logger comes with several built-in transports:

### ConsoleTransport

Logs messages to the console.

```typescript
import { Logger, ConsoleTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
transports: [new ConsoleTransport()]
});

logger.info('This goes to the console');
```

### MemoryTransport

Stores logs in memory, useful for displaying logs in a UI.

```typescript
import { Logger, MemoryTransport } from '@pixielity/advanced-logger';

const memoryTransport = new MemoryTransport({ maxLogs: 100 });
const logger = new Logger({
transports: [memoryTransport]
});

logger.info('This is stored in memory');

// Later, retrieve the logs
const logs = await memoryTransport.getLogs();
console.log(logs); // Array of log entries
```

### LocalStorageTransport

Stores logs in the browser's localStorage.

```typescript
import { Logger, LocalStorageTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
transports: [new LocalStorageTransport({
key: 'app_logs', // localStorage key
maxLogs: 100 // Maximum number of logs to keep
})]
});

logger.info('This is stored in localStorage');

// Later, retrieve the logs
const storageTransport = logger.transports[0] as LocalStorageTransport;
const logs = storageTransport.getLogs();
```

### IndexedDBTransport

Stores logs in the browser's IndexedDB, suitable for larger log volumes.

```typescript
import { Logger, IndexedDBTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
transports: [new IndexedDBTransport({
databaseName: 'app_logs', // IndexedDB database name
maxLogs: 1000 // Maximum number of logs to keep
})]
});

logger.info('This is stored in IndexedDB');

// Later, retrieve the logs
const dbTransport = logger.transports[0] as IndexedDBTransport;
const logs = await dbTransport.getLogs();
```

### HttpTransport

Sends logs to a remote endpoint.

```typescript
import { Logger, HttpTransport } from '@pixielity/advanced-logger';

const logger = new Logger({
transports: [new HttpTransport({
endpoint: 'https://logs.example.com/api',
headers: { 'Authorization': 'Bearer token' },
batchSize: 10, // Number of logs to batch before sending
batchInterval: 5000 // Milliseconds to wait before sending a batch
})]
});

logger.info('This is sent to the remote endpoint');

// Force send any pending logs
const httpTransport = logger.transports[0] as HttpTransport;
await httpTransport.flush();
```

## Using Multiple Transports

You can use multiple transports with a single logger:

```typescript
import {
Logger,
ConsoleTransport,
MemoryTransport,
HttpTransport
} from '@pixielity/advanced-logger';

const logger = new Logger({
transports: [
new ConsoleTransport(),
new MemoryTransport({ maxLogs: 100 }),
new HttpTransport({ endpoint: 'https://logs.example.com/api' })
]
});

// This log goes to all three transports
logger.info('Important message');
```

## Adding and Removing Transports

You can add and remove transports after creating a logger:

```typescript
import { Logger, ConsoleTransport, MemoryTransport } from '@pixielity/advanced-logger';

// Start with just console logging
const logger = new Logger({
transports: [new ConsoleTransport()]
});

// Add memory transport later
const memoryTransport = new MemoryTransport({ maxLogs: 100 });
logger.addTransport(memoryTransport);

// Remove all transports
logger.clearTransports();
```

## Creating a Custom Transport

You can create your own transport by implementing the `Transport` interface:

```typescript
import { Transport, LogLevelType } from '@pixielity/advanced-logger';

class CustomTransport implements Transport {
log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void {
// Implement your custom logging logic here
// For example, send to a custom analytics service

    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      context
    };

    // Example: send to a custom service
    fetch('https://analytics.example.com/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(err => console.error('Failed to send log:', err));

}

// Optionally implement clear and getLogs methods
clear(): void {
// Clear logs if applicable
}

getLogs(): Array<any> {
// Return logs if applicable
return [];
}
}

// Use your custom transport
const logger = new Logger({
transports: [new CustomTransport()]
});
```

## Best Practices

1. **Use the right transport for the job**:

   - ConsoleTransport for development
   - MemoryTransport for UI displays
   - LocalStorageTransport for simple persistence
   - IndexedDBTransport for larger log volumes
   - HttpTransport for server-side logging

2. **Consider performance**:

   - Be mindful of the performance impact of your transports
   - Use batching with HttpTransport to reduce network requests
   - Set appropriate maxLogs values to prevent memory issues

3. **Handle errors**:

   - Implement error handling in custom transports
   - Consider what happens if a transport fails

4. **Clean up**:
   - Dispose of transports that use resources (e.g., HttpTransport)
   - Clear logs when appropriate to free up resources

By effectively using transports, you can create a flexible logging system that meets your application's specific needs.
```

Let's create a guide for formatters:
