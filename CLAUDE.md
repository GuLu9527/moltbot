# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Info

This is a **fork** of the original [moltbot/moltbot](https://github.com/moltbot/moltbot) repository, customized for Chinese users.

- **My fork**: https://github.com/GuLu9527/moltbot
- **Upstream**: https://github.com/moltbot/moltbot
- **Documentation**: https://docs.molt.bot

## Git Setup

```bash
# View remotes
git remote -v

# Origin points to your fork
origin  https://github.com/GuLu9527/moltbot.git (fetch)
origin  https://github.com/GuLu9527/moltbot.git (push)

# Add upstream (for syncing original changes)
git remote add upstream https://github.com/moltbot/moltbot.git

# Sync upstream changes
git fetch upstream
git merge upstream/main
```

## Project Overview

Moltbot is a personal AI assistant that runs locally and connects to messaging channels (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.). It has a local-first Gateway control plane, multi-channel inbox, and supports voice/speech on macOS/iOS/Android.

- **Repository**: https://github.com/moltbot/moltbot
- **Documentation**: https://docs.molt.bot

## Common Commands

```bash
# Install dependencies
pnpm install

# Build project (TypeScript + UI)
pnpm build
pnpm ui:build

# Development
pnpm gateway:watch          # Gateway with auto-reload
pnpm tui                    # Terminal UI
pnpm moltbot dashboard      # Web control panel
pnpm moltbot onboard        # Initial setup wizard

# Lint & Format
pnpm lint                   # Oxlint
pnpm format:fix             # Auto-format with Oxfmt

# Testing
pnpm test                   # Unit tests (vitest)
pnpm test:coverage          # With coverage report
pnpm test:e2e               # End-to-end tests
pnpm test:watch             # Watch mode

# Single test file
vitest run path/to/test.test.ts
```

## Architecture

- **Source code**: `src/` - TypeScript ESM modules
  - `src/cli` - CLI entry points and commands
  - `src/gateway` - WebSocket control plane
  - `src/channels` - Channel implementations (telegram, discord, slack, signal, etc.)
  - `src/commands` - CLI command handlers
  - `src/providers` - Model providers (Anthropic, OpenAI)
- **Tests**: Colocated `*.test.ts` alongside source files
- **UI**: `ui/` - Control UI (Lit + Vite)
- **Apps**: `apps/` - iOS, Android, macOS native apps
- **Extensions**: `extensions/` - Optional channel plugins (msteams, matrix, zalo)
- **Build output**: `dist/` - Compiled JavaScript

## Key Conventions

- **Language**: TypeScript (ESM), strict typing preferred
- **Testing**: Vitest with 70% coverage thresholds
- **Formatting**: Oxlint/Oxfmt (run `pnpm lint` before commits)
- **Channel development**: Consider all built-in + extension channels when refactoring shared logic
- **Naming**: Use "Moltbot" for product/docs, `moltbot` for CLI/config
- **Files**: Keep under ~500 LOC when feasible; extract helpers instead of V2 copies

## Git Workflow

```bash
# Commit changes (use committer script)
scripts/committer "<message>" <files...>

# Sync upstream
git fetch origin
git merge origin/main
```

## Security

Treat all inbound DMs as untrusted input. Default DM policy requires pairing code approval.
