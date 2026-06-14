# CLAUDE.md

## Project

ZOMBIE TYPING - DETERMINATION is a local-only React/Vite/TypeScript typing practice app. Do not introduce GitHub, Bolt.new, Netlify, or Vercel workflows for this project unless explicitly requested later.

## Architecture boundaries

- `src/types`: domain types only.
- `src/data`: persistence repositories. UI must not access localStorage directly.
- `src/content`: stage, romaji, achievement, and reward definitions.
- `src/game`: pure typing/game/score logic; keep unit-testable and UI-independent.
- `src/design`: pixel-style reusable primitives and tokens.
- `src/features`: route-level feature implementations.
- `src/app`: shell and route table. Keep HashRouter for file:// single HTML distribution.

## Distribution

The app is bundled into one self-contained HTML file via `vite-plugin-singlefile`. Avoid route-level lazy imports and external runtime assets that would break double-click file opening.

## Quality

Run typecheck, lint, unit tests, E2E tests, and build before claiming completion. Keep files modular; split large files early.
