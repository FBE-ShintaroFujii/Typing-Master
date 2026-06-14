import { motion } from 'framer-motion'
import { PixelButton } from '../../../design/index.ts'

// ── Game Over ─────────────────────────────────────────────────────────────────

interface GameOverOverlayProps {
  remainingChars: number
  onRetry: () => void
  onMap: () => void
}

export function GameOverOverlay({ remainingChars, onRetry, onMap }: GameOverOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-pixel-night/90 p-8 text-center"
    >
      {/* Pixel flicker effect on title */}
      <motion.h1
        className="mb-4 font-pixel text-4xl text-pixel-red"
        animate={{ opacity: [1, 0.4, 1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
      >
        GAME OVER
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-2 font-pixel text-xl text-pixel-gold"
      >
        DETERMINATION...
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8 font-pixel text-sm text-pixel-cream/70"
      >
        あと <span className="text-pixel-gold">{remainingChars}</span> 文字でクリアだった！
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4"
      >
        <PixelButton onClick={onRetry} className="text-pixel-green">
          ▶ もう一度
        </PixelButton>
        <PixelButton onClick={onMap}>
          ← マップへ
        </PixelButton>
      </motion.div>
    </motion.div>
  )
}

// ── Clear ─────────────────────────────────────────────────────────────────────

interface ClearOverlayProps {
  isNewRecord: boolean
  points: number
  accuracy: number
  onResult: () => void
  onRetry: () => void
}

export function ClearOverlay({ isNewRecord, points, accuracy, onResult, onRetry }: ClearOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-pixel-night/90 p-8 text-center"
    >
      {/* Pixel particle burst simulation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        <h1 className="font-pixel text-5xl text-pixel-green">CLEAR!</h1>
      </motion.div>

      {isNewRecord && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, color: ['#ffd166', '#78d64b', '#ffd166'] }}
          transition={{ delay: 0.3, color: { duration: 1, repeat: Infinity } }}
          className="mt-2 font-pixel text-lg text-pixel-gold"
        >
          ★ NEW RECORD! ★
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 space-y-1 font-pixel text-sm text-pixel-cream/80"
      >
        <p>
          スコア: <span className="text-pixel-gold">{points}</span> pts
        </p>
        <p>
          正確率: <span className="text-pixel-gold">{Math.round(accuracy * 100)}</span>%
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex gap-4"
      >
        <PixelButton onClick={onResult} className="text-pixel-green">
          ▶ リザルト
        </PixelButton>
        <PixelButton onClick={onRetry}>
          ↺ もう一度
        </PixelButton>
      </motion.div>
    </motion.div>
  )
}
