import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function PixelButton({ children, className = '', ...props }: PixelButtonProps) {
  return (
    <button
      className={`border-4 border-pixel-cream bg-pixel-panel px-5 py-3 font-pixel text-sm text-pixel-cream shadow-pixel transition hover:-translate-y-0.5 hover:bg-pixel-purple focus:outline-none focus:ring-4 focus:ring-pixel-gold ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
