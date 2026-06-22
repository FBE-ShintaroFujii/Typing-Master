# CLAUDE.md

## Project

ZOMBIE TYPING - DETERMINATION — React/Vite/TypeScript タイピング練習アプリ。
CI/CD: Warp（開発）→ GitHub（push）→ Bolt.new（プレビュー確認）→ Netlify（本番）。

## Tech stack

- Vite **v5** + React 19 + TypeScript 6（strict）
- Tailwind CSS **v3** + PostCSS（`postcss.config.cjs`）+ `tailwind.config.js`
- React Router v7（HashRouter）、Framer Motion、Recharts、Zustand
- テスト: Vitest v2 + React Testing Library + jsdom

## Architecture boundaries

- `src/types`: domain types only.
- `src/data`: persistence repositories. UI must not access localStorage directly.
- `src/content`: stage, romaji, achievement, and reward definitions.
- `src/game`: pure typing/game/score logic; keep unit-testable and UI-independent.
- `src/design`: pixel-style reusable primitives and tokens.
- `src/features`: route-level feature implementations.
- `src/app`: shell and route table.
- `src/hooks`: shared React hooks.

## Routing（重要）

すべてのルートコンポーネントは **React.lazy** で遅延読み込みする。
`src/app/routes.tsx` に `Suspense` + `HashRouter` を使用。
- Bolt WebContainer の初期バンドルハングを防ぐために必須
- `vite-plugin-singlefile`（`npm run build:bundle`）でも正常動作する

## Distribution

- **開発/Bolt**: `npm run dev`（Vite dev server）
- **Netlify用ビルド**: `npm run build`（通常Viteビルド）
- **手渡し用オフラインバンドル**: `npm run build:bundle`（`vite.bundle.config.ts` + `vite-plugin-singlefile` → `dist/index.html` を単一HTML化）

## Hooks

- `src/hooks/useAppData.ts` — reactive wrapper around `LocalStorageProgressRepository`. All UI reads/writes app state through this hook.
- `src/hooks/useCountUp.ts` — animates a number from 0 to a target using `requestAnimationFrame` with a cubic ease-out curve.

## Feature pages (child)

- `src/features/title/TitlePage.tsx` — Undertale-style title screen with Framer Motion button animations and a dialog for unread parent messages.
- `src/features/game/map/GameMapPage.tsx` — RPG stage map. Stage unlock is sequential: Level N requires Level N−1 cleared. Cleared stages show ✓; locked ones show a disabled span.
- `src/features/game/result/GameResultPage.tsx` — Result screen that receives `{ session, newAchievementIds }` via React Router location state, saves the session idempotently, shows animated counters, NEW RECORD detection, and achievement badges.
- `src/features/profile/ProfilePage.tsx` — Player level/SKILL bars, item grid (grayed when locked), achievement badges (gold when earned).
- `src/features/progress/ProgressPage.tsx` — Today's summary stats and a Recharts `LineChart` showing average CPM over the past 7 days.

## Content

- `src/content/items.ts` — `RewardItem[]` definitions (weapons, armor, friends, costumes, backgrounds).

## Quality

Run typecheck, lint, unit tests, E2E tests, and build before claiming completion. Keep files modular; split large files early.

## ⚠️ Bolt.new の危険な挙動（既知の問題）

Bolt.new は GitHub からの pull を自動的に行い、自身のエディタ上の状態で**複数のソースファイルを上書き push**することがある。
このときコミットメッセージは `Updated README.md` など無害に見える名称がつく。

**実際に起きたこと（2026-06-22）:**
- Bolt が `Updated README.md` という1コミットで 25 以上のソースファイルを古いバージョンに上書き
- `TitlePage.tsx`・`useAppData.ts`・`PlayerContext.tsx` など重要ファイルが全てリバートされた
- GitHub Pages に古いバージョンがデプロイされ続けた

**対処法:**
1. push が拒否されたら `git --no-pager show <Bolt-commit> --name-only` でBoltが変えたファイルを確認する
2. ソースファイルが意図せず変更されていたら `git checkout <last-good-commit> -- <ファイルリスト>` で復元する
3. 今後 Bolt 側で変更が入ったら必ずファイル一覧を確認すること

**予防策:**
- 開発はすべて Warp（ローカル）で行い、Bolt はプレビュー確認のみに使う
- Bolt のエディタ上でコードを直接編集しない

## Parent (おとうさん) mode — `src/features/parent/`

- `parentUtils.ts`: Pure aggregation helpers (`aggregateDailyPoints`, `getPeriodSummary`, `getTodaySummary`, `getStuckStageId`, `formatSeconds`, `formatDateTime`). No React.
- `useParentData.ts`: React hook wrapping `LocalStorageProgressRepository`. Provides `snapshot` and `save`.
- `ParentDashboardPage.tsx`: Today & week summary cards, player status panel, nav buttons.
- `ParentGraphPage.tsx`: 7/30-day period selector + three Recharts LineCharts (practice time, CPM, accuracy).
- `ParentMessagePage.tsx`: Compose form (textarea, char counter, send) + sent-message list with read/unread badges and delete for read messages.
