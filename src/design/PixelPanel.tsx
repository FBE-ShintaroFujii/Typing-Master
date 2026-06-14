import type { ReactNode } from 'react'

interface PixelPanelProps {
  children: ReactNode
  className?: string
}

export function PixelPanel({ children, className = '' }: PixelPanelProps) {
  return (
    <section className={`border-4 border-pixel-cream bg-pixel-panel p-6 shadow-pixel ${className}`}>
      {children}
    </section>
  )
}
