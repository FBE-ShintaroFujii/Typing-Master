import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AchievementDefinition, SessionRecord } from '../../../types/index.ts'
import { achievements as achievementDefs } from '../../../content/index.ts'
import { useAppData } from '../../../hooks/useAppData.ts'
import { useCountUp } from '../../../hooks/useCountUp.ts'
import { PixelButton, PixelPanel } from '../../../design/index.ts'

interface ResultState {
  session: SessionRecord
  newAchievementIds?: string[]
}

export function GameResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { snapshot, save } = useAppData()

  const state = location.state as ResultState | null
  const session = state?.session ?? null
  const newAchievementIds = state?.newAchievementIds ?? []

  // Save session once on mount (idempotent via ID check)
  const savedRef = useRef(false)
  useEffect(() => {
    if (!session || savedRef.current) return
    savedRef.current = true
    const alreadySaved = snapshot.sessions.some((s) => s.id === session.id)
    if (!alreadySaved) {
      save({
        ...snapshot,
        sessions: [...snapshot.sessions, session],
        profile: {
          ...snapshot.profile,
          totalPoints: snapshot.profile.totalPoints + session.pointsEarned,
        },
      })
    }
  }, [session, snapshot, save])

  const prevBestCpm = snapshot.sessions
    .filter((s) => s.stageId === session?.stageId && s.id !== session?.id)
    .reduce((best, s) => Math.max(best, s.charsPerMinute), 0)

  const isNewRecord = session !== null && session.charsPerMinute > prevBestCpm

  const displayPoints = useCountUp(session?.pointsEarned ?? 0)
  const displayCpm = useCountUp(Math.round(session?.charsPerMinute ?? 0))

  const newAchievements = newAchievementIds
    .map((id) => achievementDefs.find((a) => a.id === id))
    .filter((a): a is AchievementDefinition => a !== undefined)

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <PixelPanel className="space-y-4 text-center">
          <p className="font-pixel text-pixel-red">セッションデータがありません</p>
          <Link to="/game/map">
            <PixelButton>マップへ</PixelButton>
          </Link>
        </PixelPanel>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <PixelPanel className="space-y-2 text-center">
          <motion.h1
            className="font-pixel text-4xl text-pixel-gold"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
          >
            {session.cleared ? 'STAGE CLEAR!' : 'RESULT'}
          </motion.h1>
          {isNewRecord && (
            <motion.p
              className="font-pixel text-xl text-pixel-green"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ★ NEW RECORD! ★
            </motion.p>
          )}
        </PixelPanel>

        {/* Stats */}
        <PixelPanel className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">POINTS</p>
              <p className="font-pixel text-3xl text-pixel-gold">{displayPoints}</p>
            </div>
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">CPM</p>
              <p className="font-pixel text-3xl text-pixel-green">{displayCpm}</p>
            </div>
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">ACCURACY</p>
              <p className="font-pixel text-3xl text-pixel-cream">
                {Math.round(session.accuracy * 100)}%
              </p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-pixel-cream/50">
            <span>ミス: {session.mistakeCount}回</span>
            <span>タイム: {session.durationSeconds}秒</span>
            <span>文字数: {session.correctChars}</span>
          </div>
        </PixelPanel>

        {/* New achievements */}
        {newAchievements.length > 0 && (
          <PixelPanel className="space-y-3">
            <h2 className="font-pixel text-lg text-pixel-gold">🏆 実績解放！</h2>
            <div className="flex flex-wrap gap-3">
              {newAchievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  className="rounded border-2 border-pixel-gold bg-pixel-night px-3 py-2 text-center"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 + i * 0.1 }}
                >
                  <p className="font-pixel text-sm text-pixel-gold">{ach.name}</p>
                  <p className="text-xs text-pixel-cream/70">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </PixelPanel>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <PixelButton
              className="w-full"
              onClick={() => { navigate(`/game/stage/${session.stageId}`) }}
            >
              ▶ もう一度
            </PixelButton>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Link to="/game/map" className="block">
              <PixelButton className="w-full">マップへ</PixelButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
