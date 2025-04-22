# Context-Aware Logging

Context-aware logging is a powerful feature of Advanced Logger that allows you to attach additional data to your logs. This guide explains how to use context effectively in your logging.

## Understanding Context

Context is additional data that provides background information for your logs. It can include:

- Application information (name, version, environment)
- User information (user ID, session ID)
- Request information (request ID, IP address)
- System information (hostname, process ID)

Context helps you correlate logs and understand the circumstances in which they were generated.

## Global Context

Global context applies to all loggers in your application. It's useful for information that's relevant to all logs.

\`\`\`typescript
import { addToGlobalContext, clearGlobalContext, Logger } from 'advanced-logger';

// Set global context at application startup
addToGlobalContext({
app: 'MyApp',
version: '1.0.0',
environment: 'production',
hostname: 'server-01'
});

// All loggers will include this context
const logger = new Logger();
logger.info('Application started'); // Includes global context

// Clear global context when shutting down
clearGlobalContext();
\`\`\`

## Logger-Specific Context

You can add context to a specific logger using the `withContext` method:

\`\`\`typescript
import { Logger } from 'advanced-logger';

const logger = new Logger();

// Create a new logger with context
const requestLogger = logger.withContext({
requestId: 'req-123',
path: '/api/users',
method: 'GET',
ip: '192.168.1.1'
});

requestLogger.info('Request received'); // Includes request context
\`\`\`

## User Context

For user-related logging, you can create a logger with user context:

\`\`\`typescript
import { Logger } from 'advanced-logger';

const logger = new Logger();

function logUserActivity(userId, action) {
// Create a logger with user context
const userLogger = logger.withContext({
userId: userId,
sessionId: 'sess-456'
});

userLogger.info(`User performed ${action}`); // Includes user context
}

logUserActivity('user-123', 'login');
\`\`\`

## Removing Context

You can remove specific context keys using the `withoutContext` method:

\`\`\`typescript
import { Logger } from 'advanced-logger';

const logger = new Logger();

// Create a logger with context
const userLogger = logger.withContext({
userId: 'user-123',
sessionId: 'sess-456',
email: 'user@example.com',
role: 'admin'
});

// Create a logger without sensitive information
const safeLogger = userLogger.withoutContext(['email']);

safeLogger.info('User profile viewed'); // Includes userId, sessionId, role, but not email
\`\`\`

## Combining Global and Logger Context

Global context and logger-specific context are merged when logs are created:

\`\`\`typescript
import { addToGlobalContext, Logger } from 'advanced-logger';

// Set global context
addToGlobalContext({
app: 'MyApp',
environment: 'production'
});

const logger = new Logger();

// Add logger-specific context
const userLogger = logger.withContext({
userId: 'user-123'
});

// This log includes both global and logger-specific context
userLogger.info('User logged in');
\`\`\`

## Context in Formatters

Formatters can access and format context data:

\`\`\`typescript
import { LogFormatter, LogData } from 'advanced-logger';

class ContextAwareFormatter implements LogFormatter {
format(logData: LogData): { message: string; metadata?: Record<string, any> } {
const { level, timestamp, prefix, message, metadata, context } = logData;

    let formattedMessage = `[${level.toUpperCase()}] ${message}`;

    // Add context details to the message
    if (context) {
      if (context.userId) {
        formattedMessage = `[User: ${context.userId}] ${formattedMessage}`;
      }

      if (context.requestId) {
        formattedMessage = `[Request: ${context.requestId}] ${formattedMessage}`;
      }
    }

    return {
      message: formattedMessage,
      metadata
    };

}
}
\`\`\`

## Best Practices

1. **Use global context for application-wide information**:

   - Application name and version
   - Environment (development, staging, production)
   - Deployment information

2. **Use logger-specific context for request or user information**:

   - Request IDs
   - User IDs
   - Session information

3. **Be mindful of sensitive information**:

   - Don't log sensitive data like passwords or tokens
   - Use `withoutContext` to remove sensitive fields when needed

4. **Structure your context**:

   - Use consistent naming conventions
   - Group related information (e.g., `user.id`, `user.role`)
   - Keep context objects reasonably sized

5. **Clear context when appropriate**:
   - Clear request context after the request is complete
   - Clear user context after the user logs out
   - Clear global context when shutting down

By effectively using context in your logging, you can create more informative and useful logs that help you understand your application's behavior.
\`\`\`

Let's create a guide for using the logger in React applications:
