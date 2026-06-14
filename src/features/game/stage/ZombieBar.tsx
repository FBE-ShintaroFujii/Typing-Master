import { motion } from 'framer-motion'
import type { DangerTier } from '../../../game/index.ts'

interface ZombieBarProps {
  /** 0.0 = at player (danger), 1.0 = far away (safe) */
  zombieDistance: number
  tier: DangerTier
}

const TIER_COLORS: Record<DangerTier, string> = {
  safe: '#78d64b',    // pixel-green
  warn: '#ffd166',    // pixel-gold
  danger: '#f04452',  // pixel-red
}

const TIER_LABELS: Record<DangerTier, string> = {
  safe: 'SAFE',
  warn: '⚠ WARNING',
  danger: '⚠ DANGER',
}

export function ZombieBar({ zombieDistance, tier }: ZombieBarProps) {
  const barColor = TIER_COLORS[tier]
  const label = TIER_LABELS[tier]

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between font-pixel text-xs">
        <span className="text-pixel-cream/60">🏃 PLAYER</span>
        <motion.span
          animate={{ color: barColor }}
          transition={{ duration: 0.3 }}
          style={{ color: barColor }}
        >
          {label}
        </motion.span>
        <span className="text-pixel-cream/60">🧟 ZOMBIE</span>
      </div>

      {/* Track */}
      <div className="relative h-8 overflow-hidden border-2 border-pixel-cream/30 bg-pixel-night">
        {/* Distance fill (shows "safe zone") */}
        <motion.div
          className="absolute left-0 top-0 h-full"
          animate={{ width: `${zombieDistance * 100}%`, backgroundColor: barColor }}
          transition={{ duration: 0.15, ease: 'linear' }}
          style={{ backgroundColor: barColor, opacity: 0.25 }}
        />
        {/* Zombie icon */}
        <motion.div
          className="absolute top-0 flex h-full items-center text-2xl leading-none"
          animate={{ left: `${Math.max(0, zombieDistance * 95)}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
          style={{ left: `${Math.max(0, zombieDistance * 95)}%` }}
        >
          🧟
        </motion.div>
        {/* Player icon (fixed at left) */}
        <div className="absolute left-1 top-0 flex h-full items-center text-xl leading-none">🏃</div>
      </div>
    </div>
  )
}
