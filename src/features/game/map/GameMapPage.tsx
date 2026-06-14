import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { stageDefinitions } from '../../../content/index.ts'
import { useAppData } from '../../../hooks/useAppData.ts'
import { PixelButton, PixelPanel } from '../../../design/index.ts'
import type { StageDefinition } from '../../../types/index.ts'

function isUnlocked(stage: StageDefinition, clearedIds: Set<string>): boolean {
  if (stage.level === 1) return true
  const prev = stageDefinitions.find((s) => s.level === stage.level - 1)
  return prev !== undefined && clearedIds.has(prev.id)
}

export function GameMapPage() {
  const { snapshot } = useAppData()
  const clearedIds = new Set(
    snapshot.sessions.filter((s) => s.cleared).map((s) => s.stageId),
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Player header */}
      <PixelPanel className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-pixel text-xs text-pixel-cream/60">PLAYER</p>
          <p className="font-pixel text-lg text-pixel-gold">{snapshot.profile.displayName}</p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">LEVEL</p>
            <p className="font-pixel text-2xl text-pixel-green">{snapshot.profile.level}</p>
          </div>
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">POINTS</p>
            <p className="font-pixel text-2xl text-pixel-gold">{snapshot.profile.totalPoints}</p>
          </div>
        </div>
        <Link to="/">
          <PixelButton className="text-xs">← もどる</PixelButton>
        </Link>
      </PixelPanel>

      <h1 className="font-pixel text-3xl text-pixel-cream">STAGE MAP</h1>

      {/* Stage grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stageDefinitions.map((stage, index) => {
          const unlocked = isUnlocked(stage, clearedIds)
          const cleared = clearedIds.has(stage.id)

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <PixelPanel
                className={`space-y-3 transition-opacity ${unlocked ? '' : 'opacity-50'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-pixel text-sm text-pixel-cream">{stage.title}</h2>
                  {cleared ? (
                    <span className="shrink-0 font-pixel text-lg text-pixel-green">✓</span>
                  ) : !unlocked ? (
                    <span className="shrink-0 text-lg">🔒</span>
                  ) : null}
                </div>
                <p className="text-xs text-pixel-cream/70">{stage.description}</p>
                {unlocked ? (
                  <Link to={`/game/stage/${stage.id}`}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <PixelButton className="w-full text-xs">
                        {cleared ? '▶ もう一度' : '▶ はじめる'}
                      </PixelButton>
                    </motion.div>
                  </Link>
                ) : (
                  <span className="block border-4 border-pixel-cream/20 bg-pixel-panel px-5 py-3 text-center font-pixel text-xs text-pixel-cream/40">
                    🔒 ロック中
                  </span>
                )}
              </PixelPanel>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap gap-3">
        <Link to="/profile">
          <PixelButton>👤 プロフィール</PixelButton>
        </Link>
        <Link to="/progress">
          <PixelButton>📊 練習記録</PixelButton>
        </Link>
      </div>
    </div>
  )
}
