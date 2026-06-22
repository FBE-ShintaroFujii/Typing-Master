import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return <main className="min-h-screen bg-pixel-night text-pixel-cream">{children}</main>
}
