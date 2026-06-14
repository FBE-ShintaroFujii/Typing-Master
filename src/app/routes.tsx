import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './AppShell.tsx'

const TitlePage = lazy(() => import('../features/title/TitlePage.tsx').then(m => ({ default: m.TitlePage })))
const GameMapPage = lazy(() => import('../features/game/map/GameMapPage.tsx').then(m => ({ default: m.GameMapPage })))
const GameStagePage = lazy(() => import('../features/game/stage/GameStagePage.tsx').then(m => ({ default: m.GameStagePage })))
const GameResultPage = lazy(() => import('../features/game/result/GameResultPage.tsx').then(m => ({ default: m.GameResultPage })))
const ProfilePage = lazy(() => import('../features/profile/ProfilePage.tsx').then(m => ({ default: m.ProfilePage })))
const ProgressPage = lazy(() => import('../features/progress/ProgressPage.tsx').then(m => ({ default: m.ProgressPage })))
const ParentDashboardPage = lazy(() => import('../features/parent/ParentDashboardPage.tsx').then(m => ({ default: m.ParentDashboardPage })))
const ParentGraphPage = lazy(() => import('../features/parent/ParentGraphPage.tsx').then(m => ({ default: m.ParentGraphPage })))
const ParentMessagePage = lazy(() => import('../features/parent/ParentMessagePage.tsx').then(m => ({ default: m.ParentMessagePage })))

const Loading = () => (
  <div style={{ padding: 40, color: '#ffd166', background: '#0b0b16', fontFamily: 'monospace', minHeight: '100vh' }}>
    Loading...
  </div>
)

export function AppRouteProvider() {
  return (
    <HashRouter>
      <AppShell>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<TitlePage />} />
            <Route path="/game/map" element={<GameMapPage />} />
            <Route path="/game/stage/:id" element={<GameStagePage />} />
            <Route path="/game/result" element={<GameResultPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
            <Route path="/parent/graph" element={<ParentGraphPage />} />
            <Route path="/parent/message" element={<ParentMessagePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </HashRouter>
  )
}
