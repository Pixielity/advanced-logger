# Using Advanced Logger with Next.js

This guide explains how to effectively use Advanced Logger in Next.js applications, handling both client-side and server-side logging.

## Setting Up the Logger

First, create a logger configuration that works in both client and server environments:

\`\`\`typescript
// src/lib/logger.ts
import { Logger, ConsoleTransport, textFormatter, MemoryTransport, HttpTransport } from 'advanced-logger';

// Determine if we're running on the server
const isServer = typeof window === 'undefined';

// Create appropriate transports based on environment
const createTransports = () => {
const transports = [new ConsoleTransport()];

// Add memory transport on client side for UI display
if (!isServer) {
transports.push(new MemoryTransport({ maxLogs: 100 }));
}

// Add HTTP transport in production
if (process.env.NODE_ENV === 'production') {
transports.push(
new HttpTransport({
endpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT || '/api/logs',
batchSize: 10,
batchInterval: 5000
})
);
}

return transports;
};

// Create the logger
export const logger = new Logger({
prefix: isServer ? 'NextServer' : 'NextClient',
formatter: textFormatter,
transports: createTransports()
});

// Add global context
if (isServer) {
// Server-specific context
logger.withContext({
environment: process.env.NODE_ENV,
nodeVersion: process.version
});
} else {
// Client-specific context
logger.withContext({
environment: process.env.NODE_ENV,
userAgent: navigator.userAgent,
viewport: `${window.innerWidth}x${window.innerHeight}`
});
}

// Export the memory transport for UI components (client-side only)
export const memoryTransport = !isServer
? createTransports().find(t => t instanceof MemoryTransport) as MemoryTransport
: null;
\`\`\`

## Creating a Log API Route

Create an API route to receive logs from the client:

\`\`\`typescript
// src/pages/api/logs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST') {
return res.status(405).json({ message: 'Method not allowed' });
}

try {
const logs = Array.isArray(req.body) ? req.body : [req.body];

    // Log each entry with the server logger
    logs.forEach(log => {
      const { level, message, metadata, context } = log;

      // Add request information to context
      const requestContext = {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        ...context
      };

      // Log with the appropriate level
      switch (level) {
        case 'info':
          logger.info(message, { ...metadata, context: requestContext });
          break;
        case 'warn':
          logger.warn(message, { ...metadata, context: requestContext });
          break;
        case 'error':
          logger.error(message, { ...metadata, context: requestContext });
          break;
        case 'debug':
          logger.debug(message, { ...metadata, context: requestContext });
          break;
        default:
          logger.info(message, { ...metadata, context: requestContext });
      }
    });

    res.status(200).json({ success: true });

} catch (error) {
logger.error('Error processing logs', { error });
res.status(500).json({ message: 'Error processing logs' });
}
}
\`\`\`

## Logging in Server Components

For Next.js App Router with React Server Components:

\`\`\`typescript
// src/app/users/page.tsx
import { logger } from '@/lib/logger';

export default async function UsersPage() {
logger.info('Rendering Users page');

try {
// Fetch data
const response = await fetch('https://api.example.com/users');
const users = await response.json();

    logger.info('Users data fetched successfully', { count: users.length });

    return (
      <div>
        <h1>Users</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    );

} catch (error) {
logger.error('Failed to fetch users', { error });

    return (
      <div>
        <h1>Users</h1>
        <p>Failed to load users</p>
      </div>
    );

}
}
\`\`\`

## Logging in Client Components

For client-side components:

\`\`\`typescript
// src/components/UserForm.tsx
'use client';

import { useState } from 'react';
import { logger } from '@/lib/logger';

export default function UserForm() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

    // Create a component-specific logger with context
    const formLogger = logger.withContext({
      component: 'UserForm',
      formData: { name, email }
    });

    formLogger.info('Form submission started');
    setStatus('submitting');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      formLogger.info('Form submission successful', { userId: data.id });
      setStatus('success');
      setName('');
      setEmail('');
    } catch (error) {
      formLogger.error('Form submission failed', { error });
      setStatus('error');
    }

};

return (

<form onSubmit={handleSubmit}>
<div>
<label htmlFor="name">Name</label>
<input
id="name"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>
</div>
<div>
<label htmlFor="email">Email</label>
<input
id="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</div>
<button type="submit" disabled={status === 'submitting'}>
{status === 'submitting' ? 'Submitting...' : 'Submit'}
</button>
{status === 'error' && <p>An error occurred. Please try again.</p>}
{status === 'success' && <p>User created successfully!</p>}
</form>
);
}
\`\`\`

## Logging in API Routes

For API routes in the Pages Router:

\`\`\`typescript
// src/pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// Create a request-specific logger with context
const requestLogger = logger.withContext({
endpoint: '/api/users',
method: req.method,
query: req.query,
ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
userAgent: req.headers['user-agent']
});

requestLogger.info('API request received');

if (req.method !== 'POST') {
requestLogger.warn('Method not allowed');
return res.status(405).json({ message: 'Method not allowed' });
}

try {
const { name, email } = req.body;

    if (!name || !email) {
      requestLogger.warn('Invalid request data', { body: req.body });
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Create user logic here...
    const userId = 'user_' + Date.now();

    requestLogger.info('User created successfully', { userId });
    res.status(201).json({ id: userId, name, email });

} catch (error) {
requestLogger.error('Error creating user', { error });
res.status(500).json({ message: 'Internal server error' });
}
}
\`\`\`

## Logging in Route Handlers

For App Router route handlers:

\`\`\`typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
// Create a request-specific logger with context
const requestLogger = logger.withContext({
endpoint: '/api/users',
method: 'POST',
ip: request.headers.get('x-forwarded-for') || 'unknown',
userAgent: request.headers.get('user-agent') || 'unknown'
});

requestLogger.info('Route handler request received');

try {
const body = await request.json();
const { name, email } = body;

    if (!name || !email) {
      requestLogger.warn('Invalid request data', { body });
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create user logic here...
    const userId = 'user_' + Date.now();

    requestLogger.info('User created successfully', { userId });
    return NextResponse.json(
      { id: userId, name, email },
      { status: 201 }
    );

} catch (error) {
requestLogger.error('Error creating user', { error });
return NextResponse.json(
{ message: 'Internal server error' },
{ status: 500 }
);
}
}
\`\`\`

## Logging in Middleware

For Next.js middleware:

\`\`\`typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
const requestLogger = logger.withContext({
middleware: true,
path: request.nextUrl.pathname,
method: request.method,
ip: request.headers.get('x-forwarded-for') || 'unknown',
userAgent: request.headers.get('user-agent') || 'unknown'
});

requestLogger.info('Middleware processing request');

// Example: Add response header
const response = NextResponse.next();
response.headers.set('x-middleware-cache', 'no-cache');

return response;
}

export const config = {
matcher: '/api/:path\*',
};
\`\`\`

## Creating a Log Viewer Component

Create a component to display logs in the UI:

\`\`\`typescript
// src/components/LogViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { memoryTransport } from '@/lib/logger';

export default function LogViewer() {
const [logs, setLogs] = useState<any[]>([]);

useEffect(() => {
if (!memoryTransport) {
console.warn('Memory transport not available');
return;
}

    // Update logs initially
    updateLogs();

    // Set up an interval to update logs
    const interval = setInterval(updateLogs, 1000);
    return () => clearInterval(interval);

}, []);

const updateLogs = async () => {
if (!memoryTransport) return;

    const storedLogs = await memoryTransport.getLogs();
    setLogs(storedLogs);

};

const clearLogs = async () => {
if (!memoryTransport) return;

    await memoryTransport.clear();
    setLogs([]);

};

if (!memoryTransport) {
return <div>Log viewer only available in client-side rendering</div>;
}

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
}
\`\`\`

## Best Practices for Next.js

1. **Handle server/client differences**:

   - Check for `typeof window === 'undefined'` to determine environment
   - Use different prefixes for server and client logs
   - Configure transports appropriately for each environment

2. **Use environment variables**:

   - Use `process.env.NODE_ENV` to adjust logging behavior
   - Use `NEXT_PUBLIC_` prefix for client-accessible variables
   - Store sensitive configuration in server-only variables

3. **Log important events**:

   - Page renders and data fetching
   - API requests and responses
   - Client-side navigation
   - Form submissions and user interactions
   - Errors and exceptions

4. **Add context to logs**:

   - Include request information (path, method, IP)
   - Include user information when available
   - Include component and page names

5. **Consider performance**:
   - Use appropriate log levels
   - Batch client-side logs before sending to server
   - Be mindful of log volume in production

By following these guidelines, you can effectively use Advanced Logger in your Next.js applications to improve debugging and monitoring across both client and server environments.
\`\`\`

Let's create a guide for custom transports:
