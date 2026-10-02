# Grok Archive Viewer

An offline, privacy-first desktop application for browsing and reading local Grok account export archives. Renders conversations with formatted Markdown, code syntax highlighting, and conversational threading without making external server calls.

## Features

- **100% Offline & Private**: Reads local JSON archive files directly from your disk. Zero network requests or telemetry.
- **Thread Navigation**: Fast sidebar indexing of past chats, newest first.
- **Clean Markdown Display**: Formatted user queries and assistant responses with code block formatting.
- **Electron Desktop Shell**: Lightweight cross-platform desktop UI.

## Dependencies

### Runtime Dependencies
- `dompurify`: Client-side HTML sanitizer for secure markdown rendering
- `marked`: Fast, compliant Markdown parser and compiler

### Development Dependencies
- `@types/dompurify`, `@types/marked`, `@types/node`: TypeScript type definitions
- `concurrently`: Runs build watchers and Electron simultaneously
- `cross-env`: Cross-platform environment variable configuration
- `electron`: Native desktop application framework
- `electron-builder` & `electron-packager`: Packaging tools for standalone desktop executables
- `typescript`: Static type checker
- `vite`: Fast build and development server

## Instructions

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for how to load your Grok data and run the viewer.
