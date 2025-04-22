# GlobalContext

The `GlobalContext` class manages global context data that can be applied to all loggers. It is implemented as a singleton to ensure there's only one instance.

## Import

\`\`\`typescript
import {
globalContext,
setGlobalContext,
addToGlobalContext,
removeFromGlobalContext,
clearGlobalContext,
getGlobalContext
} from 'advanced-logger';
\`\`\`

## Singleton Instance

### globalContext

The singleton instance of the GlobalContext class.

\`\`\`typescript
import { globalContext } from 'advanced-logger';

globalContext.add({ app: 'MyApp' });
\`\`\`

## Convenience Functions

### setGlobalContext(context: Record<string, any>): void

Sets the global context (replaces existing context).

\`\`\`typescript
import { setGlobalContext } from 'advanced-logger';

setGlobalContext({
app: 'MyApp',
environment: 'production',
version: '1.0.0'
});
\`\`\`

### addToGlobalContext(context: Record<string, any>): void

Adds data to the global context.

\`\`\`typescript
import { addToGlobalContext } from 'advanced-logger';

addToGlobalContext({
userId: '123',
sessionId: 'abc-xyz'
});
\`\`\`

### removeFromGlobalContext(keys: string[]): void

Removes specific keys from the global context.

\`\`\`typescript
import { removeFromGlobalContext } from 'advanced-logger';

removeFromGlobalContext(['userId', 'sessionId']);
\`\`\`

### clearGlobalContext(): void

Clears all global context data.

\`\`\`typescript
import { clearGlobalContext } from 'advanced-logger';

clearGlobalContext();
\`\`\`

### getGlobalContext(): Record<string, any>

Gets the current global context data.

\`\`\`typescript
import { getGlobalContext } from 'advanced-logger';

const context = getGlobalContext();
console.log(context); // { app: 'MyApp', environment: 'production', ... }
\`\`\`

## GlobalContext Class Methods

If you need to use the class methods directly:

### getInstance(): GlobalContext

Gets the singleton instance.

\`\`\`typescript
import { GlobalContext } from 'advanced-logger';

const context = GlobalContext.getInstance();
\`\`\`

### set(context: Record<string, any>): void

Sets the global context (replaces existing context).

\`\`\`typescript
globalContext.set({
app: 'MyApp',
environment: 'production'
});
\`\`\`

### add(context: Record<string, any>): void

Adds data to the global context.

\`\`\`typescript
globalContext.add({
userId: '123',
sessionId: 'abc-xyz'
});
\`\`\`

### remove(keys: string[]): void

Removes specific keys from the global context.

\`\`\`typescript
globalContext.remove(['userId', 'sessionId']);
\`\`\`

### clear(): void

Clears all global context data.

\`\`\`typescript
globalContext.clear();
\`\`\`

### get(): Record<string, any>

Gets the current global context data.

\`\`\`typescript
const context = globalContext.get();
\`\`\`

### has(key: string): boolean

Checks if the global context has a specific key.

\`\`\`typescript
if (globalContext.has('userId')) {
// Do something
}
\`\`\`

### getValue(key: string): any

Gets a specific value from the global context.

\`\`\`typescript
const userId = globalContext.getValue('userId');
\`\`\`

## Example Usage

\`\`\`typescript
import {
addToGlobalContext,
clearGlobalContext,
Logger,
ConsoleTransport
} from 'advanced-logger';

// Add global context that will be included in all logs
addToGlobalContext({
app: 'MyApp',
environment: 'production',
version: '1.0.0'
});

const logger = new Logger({
prefix: 'Auth',
transports: [new ConsoleTransport()]
});

// This log will include the global context
logger.info('User authenticated');

// Clean up when done
clearGlobalContext();
