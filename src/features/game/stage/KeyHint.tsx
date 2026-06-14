import { AnimatePresence, motion } from 'framer-motion'

interface KeyHintProps {
  /** Keys to highlight (next valid presses). Primary key is nextKeys[0]. */
  nextKeys: string[]
  visible: boolean
}

// ── QWERTY layout ─────────────────────────────────────────────────────────────
// Each row: [keys], left-offset in key-widths (stagger)
const ROWS: { keys: string[]; offset: number }[] = [
  { keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], offset: 0 },
  { keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'], offset: 0.5 },
  { keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'], offset: 1 },
]

// ── Sub-components ────────────────────────────────────────────────────────────

interface KeyCapProps {
  label: string
  isPrimary: boolean
  isSecondary: boolean
}

function KeyCap({ label, isPrimary, isSecondary }: KeyCapProps) {
  if (isPrimary) {
    return (
      <motion.div
        className="flex h-7 w-7 items-center justify-center border-2 border-pixel-gold bg-pixel-gold font-pixel text-xs text-pixel-night"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label}
      </motion.div>
    )
  }
  if (isSecondary) {
    return (
      <div className="flex h-7 w-7 items-center justify-center border-2 border-pixel-gold/60 bg-pixel-panel font-pixel text-xs text-pixel-gold/80">
        {label}
      </div>
    )
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center border border-pixel-cream/15 bg-pixel-panel font-pixel text-xs text-pixel-cream/30">
      {label}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function KeyHint({ nextKeys, visible }: KeyHintProps) {
  const primaryKey = nextKeys[0] ?? ''
  const secondaryKeys = new Set(nextKeys.slice(1))

  const displayKey = (k: string) => (k === ' ' ? 'SPACE' : k.toUpperCase())

  const label =
    nextKeys.length === 0
      ? ''
      : nextKeys.length === 1
        ? `PRESS  [ ${displayKey(primaryKey)} ]`
        : `PRESS  [ ${nextKeys.map(displayKey).join(' / ')} ]`

  return (
    <AnimatePresence>
      {visible && nextKeys.length > 0 && (
        <motion.div
          key="key-hint"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25 }}
          className="mt-3 flex flex-col items-center gap-2"
        >
          {/* Label */}
          <p className="font-pixel text-xs text-pixel-gold">{label}</p>

          {/* Keyboard diagram */}
          <div className="flex flex-col items-start gap-0.5">
            {ROWS.map(({ keys, offset }, rowIdx) => (
              <div
                key={rowIdx}
                className="flex gap-0.5"
                style={{ paddingLeft: `${offset * 28}px` }}
              >
                {keys.map((key) => (
                  <KeyCap
                    key={key}
                    label={key}
                    isPrimary={key === primaryKey}
                    isSecondary={secondaryKeys.has(key)}
                  />
                ))}
              </div>
            ))}
            {/* Spacebar row */}
            <div className="flex gap-0.5" style={{ paddingLeft: `${1 * 28}px` }}>
              {primaryKey === ' ' ? (
                <motion.div
                  className="flex h-7 w-44 items-center justify-center border-2 border-pixel-gold bg-pixel-gold font-pixel text-xs text-pixel-night"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  SPACE
                </motion.div>
              ) : secondaryKeys.has(' ') ? (
                <div className="flex h-7 w-44 items-center justify-center border-2 border-pixel-gold/60 bg-pixel-panel font-pixel text-xs text-pixel-gold/80">
                  SPACE
                </div>
              ) : (
                <div className="flex h-7 w-44 items-center justify-center border border-pixel-cream/15 bg-pixel-panel font-pixel text-xs text-pixel-cream/30">
                  SPACE
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Utility exports live in keyHintUtils.ts to satisfy react-refresh constraints.
