# Using Formatters

Formatters in Advanced Logger determine how log data is structured before being passed to transports. This guide explains how to use the built-in formatters and how to create custom formatters.

## Built-in Formatters

Advanced Logger comes with several built-in formatters:

### TextFormatter

Outputs logs in a standard text format.

Example: `[INFO] [App] 2023-04-22T09:55:11.000Z - User logged in`

```typescript
import { Logger, textFormatter } from '@pixielity/advanced-logger';

const logger = new Logger({
formatter: textFormatter
});

logger.info('User logged in');
```

### JsonFormatter

Outputs logs in JSON format, useful for machine processing.

Example: `{"level":"info","timestamp":"2023-04-22T09:55:11.000Z","prefix":"App","message":"User logged in"}`

```typescript
import { Logger, jsonFormatter } from '@pixielity/advanced-logger';

const logger = new Logger({
formatter: jsonFormatter
});

logger.info('User logged in');
```

### PrettyFormatter

Outputs logs in a human-readable format with emojis.

Example: `ℹ️ 09:55:11 [INFO] [App] User logged in`

```typescript
import { Logger, prettyFormatter } from '@pixielity/advanced-logger';

const logger = new Logger({
formatter: prettyFormatter
});

logger.info('User logged in');
```

### SimpleFormatter

Outputs logs in a minimal format.

Example: `INFO: User logged in`

```typescript
import { Logger, simpleFormatter } from '@pixielity/advanced-logger';

const logger = new Logger({
formatter: simpleFormatter
});

logger.info('User logged in');
```

## Changing Formatters

You can change the formatter after creating a logger:

```typescript
import { Logger, textFormatter, jsonFormatter } from '@pixielity/advanced-logger';

const logger = new Logger({
formatter: textFormatter
});

// Later, switch to JSON format
logger.setFormatter(jsonFormatter);
```

## Creating a Custom Formatter

You can create your own formatter by implementing the `LogFormatter` interface:

```typescript
import { LogFormatter, LogData } from '@pixielity/advanced-logger';

class CustomFormatter implements LogFormatter {
format(logData: LogData): { message: string; metadata?: Record<string, any> } {
const { level, timestamp, prefix, message, metadata, context } = logData;

    // Create a custom format
    const formattedTimestamp = new Date(timestamp).toLocaleTimeString();
    let formattedMessage = `${formattedTimestamp} | ${level.toUpperCase()} | ${prefix} | ${message}`;

    // Add context if present
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }

    return {
      message: formattedMessage,
      metadata: metadata
    };

}
}

// Use your custom formatter
import { Logger } from '@pixielity/advanced-logger';

const customFormatter = new CustomFormatter();
const logger = new Logger({
formatter: customFormatter
});

logger.info('Using custom formatter');
```

## Formatter with Colored Output

Here's an example of a formatter that adds colors to console output:

```typescript
import { LogFormatter, LogData, LogLevel } from '@pixielity/advanced-logger';

class ColoredFormatter implements LogFormatter {
private colors = {
[LogLevel.DEBUG]: '\x1b[34m', // Blue
[LogLevel.INFO]: '\x1b[32m', // Green
[LogLevel.WARN]: '\x1b[33m', // Yellow
[LogLevel.ERROR]: '\x1b[31m', // Red
reset: '\x1b[0m' // Reset
};

format(logData: LogData): { message: string; metadata?: Record<string, any> } {
const { level, timestamp, prefix { message: string; metadata?: Record<string, any> } {
const { level, timestamp, prefix, message, metadata, context } = logData;

    // Format with colors
    const color = this.colors[level as LogLevel] || this.colors.reset;
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    let formattedMessage = `${color}[${level.toUpperCase()}]${this.colors.reset} [${prefix}] ${formattedTime} - ${message}`;

    // Add context if present
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` (Context: ${JSON.stringify(context)})`;
    }

    return {
      message: formattedMessage,
      metadata: metadata
    };

}
}

// Use your colored formatter
import { Logger } from '@pixielity/advanced-logger';

const coloredFormatter = new ColoredFormatter();
const logger = new Logger({
formatter: coloredFormatter
});

logger.info('Colorful logging');
```

## Best Practices

1. **Choose the right formatter for your environment**:

   - Use `textFormatter` or `prettyFormatter` for development
   - Use `jsonFormatter` for production or log aggregation systems
   - Use `simpleFormatter` for minimal output

2. **Consider the transport**:

   - Some transports work better with certain formatters
   - JSON format is ideal for HTTP transport
   - Pretty format is best for console viewing

3. **Custom formatters**:

   - Keep performance in mind when creating custom formatters
   - Return both the formatted message and the original metadata
   - Handle all log levels appropriately

4. **Context handling**:
   - Decide how to display context in your formatter
   - Consider readability vs. completeness

By effectively using formatters, you can make your logs more readable and useful for both humans and machines.
```

Let's create a guide for context-aware logging:
