import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GameMapPage } from '../features/game/map/GameMapPage.tsx'
import { GameResultPage } from '../features/game/result/GameResultPage.tsx'
import { GameStagePage } from '../features/game/stage/GameStagePage.tsx'
import { ParentDashboardPage } from '../features/parent/ParentDashboardPage.tsx'
import { ParentGraphPage } from '../features/parent/ParentGraphPage.tsx'
import { ParentMessagePage } from '../features/parent/ParentMessagePage.tsx'
import { ProfilePage } from '../features/profile/ProfilePage.tsx'
import { ProgressPage } from '../features/progress/ProgressPage.tsx'
import { TitlePage } from '../features/title/TitlePage.tsx'
import { AppShell } from './AppShell.tsx'

export function AppRouteProvider() {
  return (
    <HashRouter>
      <AppShell>
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
      </AppShell>
    </HashRouter>
  )
}
