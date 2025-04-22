# Creating Custom Transports

Advanced Logger allows you to create custom transports to send logs to any destination. This guide explains how to create and use custom transports.

## Understanding the Transport Interface

All transports must implement the `Transport` interface:

```typescript
interface Transport {
log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void;

// Optional methods
clear?(): void | Promise<void>;
getLogs?(): Array<any> | Promise<Array<any>>;
}
```

The `log` method is required and handles the actual logging, while `clear` and `getLogs` are optional methods that can be implemented if your transport supports them.

## Creating a Basic Custom Transport

Here's an example of a simple custom transport that logs to a custom endpoint:

```typescript
import { Transport, LogLevelType } from '@pixielity/advanced-logger';

class CustomApiTransport implements Transport {
private endpoint: string;
private apiKey: string;

constructor(options: { endpoint: string; apiKey: string }) {
this.endpoint = options.endpoint;
this.apiKey = options.apiKey;
}

log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void {
// Create the log entry
const logEntry = {
level,
message,
timestamp: new Date().toISOString(),
metadata,
context
};

    // Send to the API endpoint
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(logEntry)
    }).catch(err => {
      // Handle errors silently to avoid infinite loops
      console.error('Failed to send log to custom API:', err);
    });

}
}

// Use the custom transport
import { Logger } from '@pixielity/advanced-logger';

const logger = new Logger({
prefix: 'MyApp',
transports: [
new CustomApiTransport({
endpoint: 'https://logs.example.com/api/logs',
apiKey: 'your-api-key'
})
]
});

logger.info('Using custom transport');
```

## Creating a Batched Transport

For better performance, you might want to batch logs before sending them:

```typescript
import { Transport, LogLevelType } from '@pixielity/advanced-logger';

class BatchedApiTransport implements Transport {
private endpoint: string;
private apiKey: string;
private batchSize: number;
private batchInterval: number;
private batch: Array<any> = [];
private timer: NodeJS.Timeout | null = null;

constructor(options: {
endpoint: string;
apiKey: string;
batchSize?: number;
batchInterval?: number;
}) {
this.endpoint = options.endpoint;
this.apiKey = options.apiKey;
this.batchSize = options.batchSize || 10;
this.batchInterval = options.batchInterval || 5000; // 5 seconds

    // Start the timer for batch sending
    this.startTimer();

}

private startTimer(): void {
if (!this.timer) {
this.timer = setInterval(() => {
this.sendBatch();
}, this.batchInterval);
}
}

private stopTimer(): void {
if (this.timer) {
clearInterval(this.timer);
this.timer = null;
}
}

private async sendBatch(): Promise<void> {
if (this.batch.length === 0) return;

    const batchToSend = [...this.batch];
    this.batch = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(batchToSend)
      });
    } catch (error) {
      console.error('Failed to send logs to API:', error);
      // Put the logs back in the batch
      this.batch = [...batchToSend, ...this.batch];
    }

}

log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void {
// Add to batch
this.batch.push({
level,
message,
timestamp: new Date().toISOString(),
metadata,
context
});

    // Send immediately if batch size reached
    if (this.batch.length >= this.batchSize) {
      this.sendBatch();
    }

}

// Force send any pending logs
async flush(): Promise<void> {
await this.sendBatch();
}

// Clean up resources
dispose(): void {
this.stopTimer();
this.sendBatch();
}
}
```

## Creating a Transport with Storage

Here's an example of a transport that stores logs in a custom storage system:

```typescript
import { Transport, LogLevelType } from '@pixielity/advanced-logger';

class CustomStorageTransport implements Transport {
private storageKey: string;
private maxLogs: number;
private logs: Array<any> = [];

constructor(options: { storageKey?: string; maxLogs?: number }) {
this.storageKey = options.storageKey || 'app_logs';
this.maxLogs = options.maxLogs || 100;

    // Load existing logs if available
    this.loadLogs();

}

private loadLogs(): void {
try {
// This is just an example - replace with your storage mechanism
const storedLogs = localStorage.getItem(this.storageKey);
if (storedLogs) {
this.logs = JSON.parse(storedLogs);
}
} catch (error) {
console.error('Failed to load logs from storage:', error);
}
}

private saveLogs(): void {
try {
// This is just an example - replace with your storage mechanism
localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
} catch (error) {
console.error('Failed to save logs to storage:', error);
}
}

log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void {
// Add new log
this.logs.unshift({
level,
message,
timestamp: new Date().toISOString(),
metadata,
context
});

    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Save to storage
    this.saveLogs();

}

clear(): void {
this.logs = [];
this.saveLogs();
}

getLogs(): Array<any> {
return [...this.logs];
}
}
```

## Creating a Transport for a Third-Party Service

Here's an example of a transport for a third-party logging service like Sentry:

```typescript
import { Transport, LogLevelType } from '@pixielity/advanced-logger';
import \* as Sentry from '@sentry/browser';

class SentryTransport implements Transport {
constructor(options: { dsn: string }) {
// Initialize Sentry
Sentry.init({
dsn: options.dsn
});
}

log(
level: LogLevelType,
message: string,
metadata?: Record<string, any>,
context?: Record<string, any>
): void {
// Map log level to Sentry level
let sentryLevel;
switch (level) {
case 'debug':
sentryLevel = Sentry.Severity.Debug;
break;
case 'info':
sentryLevel = Sentry.Severity.Info;
break;
case 'warn':
sentryLevel = Sentry.Severity.Warning;
break;
case 'error':
sentryLevel = Sentry.Severity.Error;
break;
default:
sentryLevel = Sentry.Severity.Info;
}

    // Add context to Sentry scope
    Sentry.withScope(scope => {
      // Add metadata as tags
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          scope.setTag(key, String(value));
        });
      }

      // Add context as extra data
      if (context) {
        scope.setExtras(context);
      }

      // Capture message with appropriate level
      Sentry.captureMessage(message, sentryLevel);
    });

}
}
```

## Best Practices for Custom Transports

1. **Error handling**:

   - Handle errors gracefully to avoid infinite loops
   - Log transport errors to console or another fallback
   - Consider retry mechanisms for failed log deliveries

2. **Performance considerations**:

   - Use batching for network requests
   - Implement throttling if necessary
   - Be mindful of memory usage for storage transports

3. **Resource management**:

   - Implement cleanup methods (dispose, flush)
   - Clear timers and other resources when no longer needed
   - Limit storage size for persistent transports

4. **Security**:

   - Protect sensitive information in logs
   - Use secure connections for remote endpoints
   - Validate and sanitize log data

5. **Compatibility**:
   - Make transports work in both browser and Node.js if possible
   - Handle environment-specific features gracefully
   - Provide fallbacks for unsupported features

By creating custom transports, you can extend Advanced Logger to work with any logging system or storage mechanism, making it a flexible solution for all your logging needs.
