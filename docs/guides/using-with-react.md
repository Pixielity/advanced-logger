# Using Advanced Logger with React

This guide explains how to effectively use Advanced Logger in React applications.

## Basic Setup

First, set up a logger instance for your React application:

```typescript
// src/utils/logger.ts
import { Logger, ConsoleTransport, prettyFormatter } from '@pixielity/advanced-logger';

// Create a logger instance
export const logger = new Logger({
prefix: 'ReactApp',
formatter: prettyFormatter,
transports: [new ConsoleTransport()]
});
```

## Creating a Logger Context

Create a React context to provide the logger throughout your application:

```typescript
// src/contexts/LoggerContext.tsx
import React, { createContext, useContext } from 'react';
import { Logger } from '@pixielity/advanced-logger';
import { logger } from '../utils/logger';

// Create the context
const LoggerContext = createContext<Logger>(logger);

// Create a provider component
export const LoggerProvider: React.FC<{
children: React.ReactNode;
logger?: Logger;
}> = ({ children, logger: customLogger }) => {
return (
<LoggerContext.Provider value={customLogger || logger}>
{children}
</LoggerContext.Provider>
);
};

// Create a hook to use the logger
export const useLogger = () => useContext(LoggerContext);
```

## Setting Up the Provider

Wrap your application with the LoggerProvider:

```typescript
// src/App.tsx
import React from 'react';
import { LoggerProvider } from './contexts/LoggerContext';
import { logger } from './utils/logger';
import MainComponent from './components/MainComponent';

const App: React.FC = () => {
return (
<LoggerProvider logger={logger}>
<MainComponent />
</LoggerProvider>
);
};

export default App;
```

## Using the Logger in Components

Use the logger in your components with the custom hook:

```typescript
// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { useLogger } from '../contexts/LoggerContext';

interface User {
id: string;
name: string;
email: string;
}

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
const logger = useLogger();
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
// Create a component-specific logger with context
const componentLogger = logger.withContext({
component: 'UserProfile',
userId
});

    componentLogger.info('Component mounted');

    const fetchUser = async () => {
      try {
        componentLogger.info('Fetching user data');
        setLoading(true);

        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const userData = await response.json();
        setUser(userData);
        componentLogger.info('User data fetched successfully');
      } catch (err) {
        const error = err as Error;
        componentLogger.error('Failed to fetch user data', { error: error.message });
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      componentLogger.info('Component unmounted');
    };

}, [userId, logger]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!user) return <div>No user found</div>;

return (

<div>
<h1>{user.name}</h1>
<p>{user.email}</p>
</div>
);
};

export default UserProfile;
```

## Logging React Router Navigation

If you're using React Router, you can log navigation events:

```typescript
// src/components/RouterLogger.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogger } from '../contexts/LoggerContext';

export const RouterLogger: React.FC = () => {
const location = useLocation();
const logger = useLogger();

useEffect(() => {
logger.info('Navigation', {
path: location.pathname,
search: location.search,
hash: location.hash
});
}, [location, logger]);

return null; // This component doesn't render anything
};

// Add this component to your app
// src/App.tsx
import { RouterLogger } from './components/RouterLogger';

const App: React.FC = () => {
return (
<LoggerProvider logger={logger}>
<RouterLogger />
<MainComponent />
</LoggerProvider>
);
};
```

## Logging Redux Actions

If you're using Redux, you can create a middleware to log actions:

```typescript
// src/redux/loggerMiddleware.ts
import { Middleware } from 'redux';
import { logger } from '../utils/logger';

export const loggerMiddleware: Middleware = store => next => action => {
logger.info('Redux action', {
type: action.type,
payload: action.payload,
state: store.getState()
});

return next(action);
};

// Add this middleware to your store
// src/redux/store.ts
import { createStore, applyMiddleware } from 'redux';
import { loggerMiddleware } from './loggerMiddleware';
import rootReducer from './reducers';

const store = createStore(
rootReducer,
applyMiddleware(loggerMiddleware)
);

export default store;
```

## Logging React Query

If you're using React Query, you can add logging to the query client:

```typescript
// src/utils/queryClient.ts
import { QueryClient } from 'react-query';
import { logger } from './logger';

export const queryClient = new QueryClient({
defaultOptions: {
queries: {
onError: (error) => {
logger.error('Query error', { error });
},
onSuccess: (data, variables, context) => {
logger.info('Query success', {
queryKey: context?.queryKey,
dataSize: JSON.stringify(data).length
});
}
},
mutations: {
onError: (error, variables) => {
logger.error('Mutation error', { error, variables });
},
onSuccess: (data, variables) => {
logger.info('Mutation success', {
data,
variables
});
}
}
}
});
```

## Displaying Logs in the UI

You can create a log viewer component using the MemoryTransport:

```typescript
// src/utils/logger.ts
import { Logger, ConsoleTransport, MemoryTransport, prettyFormatter } from '@pixielity/advanced-logger';

// Create a memory transport
export const memoryTransport = new MemoryTransport({ maxLogs: 100 });

// Create a logger with both console and memory transports
export const logger = new Logger({
prefix: 'ReactApp',
formatter: prettyFormatter,
transports: [new ConsoleTransport(), memoryTransport]
});

// src/components/LogViewer.tsx
import React, { useState, useEffect } from 'react';
import { memoryTransport } from '../utils/logger';

export const LogViewer: React.FC = () => {
const [logs, setLogs] = useState<any[]>([]);

useEffect(() => {
// Update logs initially
updateLogs();

    // Set up an interval to update logs
    const interval = setInterval(updateLogs, 1000);
    return () => clearInterval(interval);

}, []);

const updateLogs = async () => {
const storedLogs = await memoryTransport.getLogs();
setLogs(storedLogs);
};

const clearLogs = async () => {
await memoryTransport.clear();
setLogs([]);
};

return (

<div className="log-viewer">
<div className="log-header">
<h2>Application Logs</h2>
<button onClick={clearLogs}>Clear Logs</button>
</div>
<div className="log-container">
{logs.length === 0 ? (
<p>No logs yet.</p>
) : (
logs.map((log, index) => (
<div key={index} className={`log-entry log-${log.level}`}>
<span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
<span className="log-level">{log.level.toUpperCase()}</span>
<span className="log-message">{log.message}</span>
</div>
))
)}
</div>
</div>
);
};
```

## Best Practices

1. **Create a logger utility**:

   - Set up a centralized logger configuration
   - Export a pre-configured logger instance

2. **Use React Context for dependency injection**:

   - Provide the logger through context
   - Create a custom hook for easy access

3. **Add context to your logs**:

   - Include component names
   - Include user information when available
   - Include route information

4. **Log important lifecycle events**:

   - Component mounting/unmounting
   - Data fetching
   - User interactions
   - Error boundaries

5. **Consider performance**:

   - Don't log too frequently in render methods
   - Use appropriate log levels
   - Consider disabling debug logs in production

6. **Handle sensitive data**:
   - Don't log sensitive user information
   - Filter out passwords, tokens, etc.

By following these guidelines, you can effectively use Advanced Logger in your React applications to improve debugging and monitoring.
```

Let's create a guide for using the logger in Next.js applications:
