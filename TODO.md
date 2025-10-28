console-styler/
├── mod.ts                          # Main exports
├── core/
│   ├── logger.ts                   # Core logging functionality
│   ├── formatter.ts                # Text formatting utilities
│   ├── colors.ts                   # Color system
│   └── config.ts                   # Configuration management
├── components/
│   ├── tables.ts                   # Table rendering
│   ├── banners.ts                  # Banner generation
│   ├── progress.ts                 # Progress bars & spinners
│   ├── boxes.ts                    # Box drawing
│   └── charts.ts                   # ASCII charts (NEW!)
├── plugins/
│   ├── file-logger.ts              # Log to file
│   ├── json-logger.ts              # JSON output
│   ├── remote-logger.ts            # Send logs to remote service
│   └── plugin-interface.ts         # Plugin system
├── themes/
│   ├── default.ts
│   ├── minimal.ts
│   ├── neon.ts                     # NEW: Fun themes
│   └── theme-interface.ts
├── adapters/
│   ├── express.ts                  # Express.js middleware
│   ├── oak.ts                      # Oak middleware
│   └── hono.ts                     # Hono middleware
└── utils/
    ├── terminal.ts                 # Terminal detection
└── ansi.ts                     # ANSI code management
    ├── format-helpers.ts           # Formatting utilities
