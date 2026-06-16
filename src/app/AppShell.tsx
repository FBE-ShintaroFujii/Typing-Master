import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

const COPYRIGHT = '\u00a9 2026 \u85e4\u4e95\u4fe1\u592a\u90ce  |  ZOMBIE TYPING - DETERMINATION  |  Test Release 2026.6.16'

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-pixel-night text-pixel-cream">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-pixel-cream/10 py-2 text-center font-pixel text-pixel-cream/25"
        style={{ fontSize: '0.55rem', letterSpacing: '0.04em' }}>
        {COPYRIGHT}
      </footer>
    </div>
  )
}
