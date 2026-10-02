# Grok Archive Viewer

[![Automated Release](https://img.shields.io/badge/release-automated_batch_pipeline-blue.svg)](https://github.com/mkomorny)
[![Pipeline Execution](https://img.shields.io/badge/dispatched_by-background_script-informational.svg)](https://github.com/mkomorny)

> [!NOTE]
> **Automated Distribution**: This repository was automatically sanitized, packaged, and published via a scheduled background batch staging pipeline. All file bundling, licensing, and repository synchronization were dispatched automatically by an automated release runner.

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

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](./LICENSE) file for details.
