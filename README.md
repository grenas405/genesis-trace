# 🎨 Console Styler

A comprehensive, professional terminal logging and formatting library for Deno applications.

## Features

- 🎯 **Multiple Log Levels** - debug, info, success, warning, error, critical
- 🎨 **Themes** - default, minimal, neon, dracula (or create your own)
- 📊 **Rich Components** - tables, charts, progress bars, boxes, banners
- 🔌 **Plugin System** - file logging, remote logging, Slack integration
- 🚀 **Framework Adapters** - Oak, Hono, Express
- 🌈 **Smart Color Detection** - Auto-detects terminal capabilities
- 📝 **TypeScript First** - Full type safety and IntelliSense
- 🎭 **Interactive Prompts** - Ask questions, select options
- 🛠️ **Highly Configurable** - Customize every aspect

## Installation
```bash
deno add @yourname/console-styler
```

## Quick Start
```typescript
import { Logger } from "@yourname/console-styler";

const logger = new Logger();

logger.info('Application started');
logger.success('Database connected');
logger.warning('High memory usage');
logger.error('Failed to load file');
```

## Documentation

See [docs/](./docs/) for full documentation.

## License

MIT
