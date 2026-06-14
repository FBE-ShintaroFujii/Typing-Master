import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate } from 'framer-motion'
import zombieSvg from '../../../assets/sprites/zombie.svg'
import type { DangerTier } from '../../../game/index.ts'

interface ZombieApproachProps {
  /** 1.0 = far / safe, 0.0 = close / danger */
  zombieDistance: number
  tier: DangerTier
  /** Increment on each token/word-complete to trigger beam + hit effects. */
  hitTrigger?: number
}

const TIER_LABEL: Record<DangerTier, string> = {
  safe: 'SAFE',
  warn: '⚠ WARNING',
  danger: '⚠ DANGER',
}

const TIER_LABEL_COLOR: Record<DangerTier, string> = {
  safe: '#78d64b',
  warn: '#ffd166',
  danger: '#f04452',
}

/**
 * Player-perspective zombie approach view.
 *
 * The zombie starts as a tiny pixel at the distant horizon and grows
 * quadratically toward the viewer as zombieDistance decreases.
 * A red vignette pulses in danger tier.
 */
export function ZombieApproach({ zombieDistance, tier, hitTrigger = 0 }: ZombieApproachProps) {
  const proximity = Math.max(0, Math.min(1, 1 - zombieDistance))

  // Quadratic scale: tiny (0.05) far away → large (2.05) at the player
  const scale = 0.05 + proximity * proximity * 2.0

  // Bottom anchor: near horizon (45%) when far → floor level (0%) when close
  const groundBottomPct = 45 - proximity * proximity * 45

  // Walking bob speed increases with danger
  const bobDuration = tier === 'danger' ? 0.28 : tier === 'warn' ? 0.45 : 0.65

  const vignetteOpacity = tier === 'safe' ? 0 : tier === 'warn' ? 0.28 : 0.58

  // ── Hit effects (beam / flash / stagger) ────────────────────────────────
  const [flashKey, setFlashKey] = useState(0)
  const prevHitRef = useRef(0)
  const [zombieScope, animateZombie] = useAnimate()

  useEffect(() => {
    if (hitTrigger <= prevHitRef.current) return
    prevHitRef.current = hitTrigger
    if (zombieScope.current) {
      void animateZombie(zombieScope.current, { x: [0, -7, 7, -4, 4, 0] }, { duration: 0.15 })
    }
    setFlashKey((k) => k + 1)
  }, [hitTrigger, animateZombie, zombieScope])

  return (
    <div
      className="relative w-full select-none overflow-hidden"
      style={{
        height: 'clamp(200px, 35vw, 300px)',
        background:
          'linear-gradient(180deg, #050510 0%, #0b0d20 42%, #11182a 52%, #080604 100%)',
      }}
    >
      {/* ── Perspective corridor lines ── */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Horizon */}
        <line x1="0" y1="110" x2="400" y2="110" stroke="#1c2d44" strokeWidth="0.8" />

        {/* Ceiling lines */}
        <line x1="200" y1="110" x2="0"   y2="0"   stroke="#1c2d44" strokeWidth="1.2" opacity="0.65" />
        <line x1="200" y1="110" x2="400" y2="0"   stroke="#1c2d44" strokeWidth="1.2" opacity="0.65" />
        <line x1="200" y1="110" x2="100" y2="0"   stroke="#1c2d44" strokeWidth="0.6" opacity="0.38" />
        <line x1="200" y1="110" x2="300" y2="0"   stroke="#1c2d44" strokeWidth="0.6" opacity="0.38" />

        {/* Floor lines */}
        <line x1="200" y1="110" x2="0"   y2="220" stroke="#1c2d44" strokeWidth="1.2" opacity="0.65" />
        <line x1="200" y1="110" x2="400" y2="220" stroke="#1c2d44" strokeWidth="1.2" opacity="0.65" />
        <line x1="200" y1="110" x2="100" y2="220" stroke="#1c2d44" strokeWidth="0.6" opacity="0.38" />
        <line x1="200" y1="110" x2="300" y2="220" stroke="#1c2d44" strokeWidth="0.6" opacity="0.38" />
        <line x1="200" y1="110" x2="50"  y2="220" stroke="#1c2d44" strokeWidth="0.4" opacity="0.22" />
        <line x1="200" y1="110" x2="350" y2="220" stroke="#1c2d44" strokeWidth="0.4" opacity="0.22" />

        {/* Depth cross-bars (floor receding lines) */}
        <line x1="162" y1="120" x2="238" y2="120" stroke="#1c2d44" strokeWidth="0.5" opacity="0.28" />
        <line x1="145" y1="133" x2="255" y2="133" stroke="#1c2d44" strokeWidth="0.5" opacity="0.22" />
        <line x1="120" y1="155" x2="280" y2="155" stroke="#1c2d44" strokeWidth="0.5" opacity="0.18" />
        <line x1="82"  y1="186" x2="318" y2="186" stroke="#1c2d44" strokeWidth="0.5" opacity="0.13" />
      </svg>

      {/* ── Beam (fires on each hit) ── */}
      {hitTrigger > 0 && (
        <motion.div
          key={hitTrigger}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 4,
            height: '52%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            background: 'linear-gradient(to top, #00eeff, rgba(68,170,255,0.06))',
            boxShadow: '0 0 6px #00eeff, 0 0 20px rgba(0,238,255,0.45), 0 0 50px rgba(0,238,255,0.18)',
            zIndex: 15,
            pointerEvents: 'none',
          }}
          initial={{ scaleY: 0, opacity: 1 }}
          animate={{ scaleY: [0, 1, 1, 0], opacity: [1, 1, 0.7, 0] }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        />
      )}

      {/* ── Zombie sprite ── */}
      {/*
        Outer div: CSS transition for game-state scale + position.
        zombieScope div: imperative shake via useAnimate on each hit.
        motion.img: continuous walking-bob loop.
      */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: `${groundBottomPct.toFixed(2)}%`,
          transform: `translateX(-50%) scale(${scale.toFixed(3)})`,
          transformOrigin: 'center bottom',
          transition: 'transform 0.22s linear, bottom 0.22s linear',
          zIndex: 10,
        }}
      >
        {/* Shake scope — animated imperatively by useAnimate on each hit */}
        <div ref={zombieScope} style={{ position: 'relative' }}>
          <motion.img
            src={zombieSvg}
            alt="ゾンビ"
            draggable={false}
            width={96}
            height={120}
            style={{ display: 'block' }}
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: bobDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Hit flash overlay — new key per hit to replay fade animation */}
          {flashKey > 0 && (
            <motion.div
              key={flashKey}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.72)',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </div>
      </div>

      {/* ── Red vignette: steady layer ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: vignetteOpacity }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(120, 6, 6, 0.92) 100%)',
          zIndex: 20,
        }}
      />

      {/* ── Red vignette: pulsing layer (danger only) ── */}
      {tier === 'danger' && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.08, 0.38, 0.08] }}
          transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 22%, rgba(150, 0, 0, 0.8) 100%)',
            zIndex: 21,
          }}
        />
      )}

      {/* ── Status label ── */}
      <p
        className="absolute left-2 top-2 z-30 font-pixel text-xs"
        style={{ color: TIER_LABEL_COLOR[tier] }}
      >
        {TIER_LABEL[tier]}
      </p>
    </div>
  )
}
