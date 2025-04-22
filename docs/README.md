# Advanced Logger Documentation

Welcome to the Advanced Logger documentation. This library provides a flexible and powerful logging solution for JavaScript applications.

## Table of Contents

- [Getting Started](./getting-started.md)
- [Core Concepts](./core-concepts.md)
- [API Reference](./api/README.md)
- [Guides](./guides/README.md)
- [Examples](./examples/README.md)
- [Contributing](./contributing.md)

## Features

- Multiple log levels (debug, info, warn, error)
- Multiple transports (console, memory, localStorage, IndexedDB, HTTP)
- Customizable formatters
- Context-aware logging
- TypeScript support
- Works in browser and Node.js environments

## Installation

```bash
npm install @pixielity/advanced-logger

# or

yarn add @pixielity/advanced-logger
```

## Quick Start

```typescript
import { Logger, ConsoleTransport, textFormatter } from '@pixielity/advanced-logger';

// Create a simple logger
const logger = new Logger({
prefix: 'MyApp',
formatter: textFormatter,
transports: [new ConsoleTransport()]
});

// Log messages
logger.info('Application started');
logger.warn('Something might be wrong', { details: 'Check this out' });
logger.error('An error occurred', { error: new Error('Something failed') });
```

For more detailed information, please refer to the [Getting Started](./getting-started.md) guide.
```

Now, let's create the getting started guide:
