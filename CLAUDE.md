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

## Parent (おとうさん) mode — `src/features/parent/`

- `parentUtils.ts`: Pure aggregation helpers (`aggregateDailyPoints`, `getPeriodSummary`, `getTodaySummary`, `getStuckStageId`, `formatSeconds`, `formatDateTime`). No React.
- `useParentData.ts`: React hook wrapping `LocalStorageProgressRepository`. Provides `snapshot` and `save`.
- `ParentDashboardPage.tsx`: Today & week summary cards, player status panel, nav buttons.
- `ParentGraphPage.tsx`: 7/30-day period selector + three Recharts LineCharts (practice time, CPM, accuracy).
- `ParentMessagePage.tsx`: Compose form (textarea, char counter, send) + sent-message list with read/unread badges and delete for read messages.
