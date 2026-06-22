import { motion, AnimatePresence } from 'framer-motion'
import type { TypingState } from '../../../game/index.ts'
import { getTokenDisplays } from '../../../game/index.ts'

interface PromptDisplayProps {
  /** The kana/label shown to the player (for display only — kept for API compat). */
  label: string
  /** Current engine state to drive the romaji rendering. */
  typingState: TypingState
  /** Whether a mistake was just made (triggers shake). */
  mistake: boolean
  /** When false the romaji row is hidden (kana-only / none hint modes). Defaults to true. */
  showRomaji?: boolean
}

export function PromptDisplay({ typingState, mistake, showRomaji = true }: PromptDisplayProps) {
  const displays = getTokenDisplays(typingState)

  return (
    <div className="space-y-4 text-center">
      {/* Kana label — colour-coded by token progress */}
      <div className="flex flex-wrap justify-center gap-0 font-pixel text-3xl tracking-widest">
        {displays.map((d, i) => (
          <KanaChip key={i} source={d.source} isDone={d.isDone} isCurrent={d.isCurrent} />
        ))}
      </div>

      {/* Romaji row — hidden in kana-only / none hint modes */}
      {showRomaji && (
        <motion.div
          animate={mistake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex flex-wrap justify-center gap-0.5 font-pixel text-xl tracking-wide"
        >
          <AnimatePresence mode="wait">
            {displays.map((d, i) => (
              <TokenChip key={i} display={d} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

interface TokenChipProps {
  display: ReturnType<typeof getTokenDisplays>[number]
}

function TokenChip({ display }: TokenChipProps) {
  const { romaji, typedPart, isDone, isCurrent } = display

  if (isDone) {
    return <span className="text-pixel-green opacity-70">{romaji}</span>
  }

  if (isCurrent) {
    const typed = romaji.slice(0, typedPart.length)
    const remaining = romaji.slice(typedPart.length)
    return (
      <span>
        <span className="text-pixel-gold">{typed}</span>
        <span className="text-pixel-cream underline decoration-pixel-gold decoration-2 underline-offset-4">
          {remaining}
        </span>
      </span>
    )
  }

  return <span className="text-pixel-cream/40">{romaji}</span>
}

// ── KanaChip — hiragana token with progress colour ──────────────────────────────

interface KanaChipProps {
  /** The source kana character(s) for this token (1 char or 2-char youon compound). */
  source: string
  isDone: boolean
  isCurrent: boolean
}

function KanaChip({ source, isDone, isCurrent }: KanaChipProps) {
  if (isDone) {
    return <span className="text-pixel-green/80">{source}</span>
  }
  if (isCurrent) {
    return (
      <span className="text-pixel-gold underline decoration-pixel-gold decoration-2 underline-offset-4">
        {source}
      </span>
    )
  }
  return <span className="text-pixel-cream">{source}</span>
}
