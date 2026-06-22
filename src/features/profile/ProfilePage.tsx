import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { achievements as achievementDefs, rewardItems } from '../../content/index.ts'
import { useAppData } from '../../hooks/useAppData.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'
import type { RewardItem } from '../../types/index.ts'
import { calcLevel, getLevelInfo } from '../../shared/utils/levelCalc.ts'

const CAT_LABEL: Record<string, string> = {
  weapon: '⚔️ ぶき',
  armor: '🛡️ よろい',
  friend: '💖 なかま',
  costume: '👚 コスチューム',
  background: '🌄 バック',
}

const CAT_EMOJI: Record<string, string> = {
  weapon: '⚔️', armor: '🛡️', friend: '💖', costume: '👚', background: '🌄',
}

// ── Sub-components ───────────────────────────────────────────────────────────────────

function LevelBar({ totalPoints }: { totalPoints: number }) {
  const info = getLevelInfo(totalPoints)
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-pixel text-xs">
        <span className="text-pixel-gold">Lv.{info.level}</span>
        {info.nextLevel !== null ? (
          <span className="text-pixel-cream/50">次のLvまで {info.pointsToNext}pt</span>
        ) : (
          <span className="text-pixel-gold">MAX LEVEL</span>
        )}
      </div>
      <div className="h-3 w-full border-2 border-pixel-cream/20 bg-pixel-night">
        <motion.div
          className="h-full bg-pixel-gold"
          animate={{ width: `${info.progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

function EquippedPanel({ equippedIds }: { equippedIds: string[] }) {
  const equipped = equippedIds
    .map(id => rewardItems.find(r => r.id === id))
    .filter((r): r is RewardItem => r !== undefined)
  return (
    <PixelPanel className="space-y-2">
      <p className="font-pixel text-sm text-pixel-gold">今の装備</p>
      {equipped.length === 0 ? (
        <p className="text-xs text-pixel-cream/50">まだなにも装備していないよ</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {equipped.map(item => (
            <div key={item.id} className="flex items-center gap-1.5 rounded border border-pixel-gold/40 bg-pixel-night px-2 py-1">
              <span>{CAT_EMOJI[item.category]}</span>
              <span className="font-pixel text-xs text-pixel-cream">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </PixelPanel>
  )
}

function ConfirmDialog({
  item, currentPoints, onConfirm, onCancel,
}: {
  item: RewardItem; currentPoints: number; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 5, 16, 0.9)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xs space-y-4 border-4 border-pixel-gold bg-pixel-panel p-6 text-center"
        style={{ boxShadow: '8px 8px 0 #05050a' }}
      >
        <p className="font-pixel text-pixel-gold">購入しますか？</p>
        <p className="font-pixel text-xl text-pixel-cream">{item.name}</p>
        <p className="text-xs text-pixel-cream/70">{item.description}</p>
        {item.attackStyle && (
          <p className="font-pixel text-xs text-pixel-cream/50">⚡ {item.attackStyle.label}</p>
        )}
        <div className="flex justify-between font-pixel text-xs text-pixel-cream/60">
          <span>コスト: {item.unlockCost}pt</span>
          <span>購入後: {currentPoints - item.unlockCost}pt</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border-2 border-pixel-cream/30 py-2 font-pixel text-xs text-pixel-cream/60 hover:border-pixel-cream hover:text-pixel-cream">やめる</button>
          <button onClick={onConfirm} className="flex-1 bg-pixel-gold py-2 font-pixel text-xs text-pixel-night hover:opacity-90">買う！</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProfilePage() {
  const { snapshot, save } = useAppData()
  const { profile, achievements } = snapshot

  const [confirmItem, setConfirmItem] = useState<RewardItem | null>(null)
  const [justBoughtId, setJustBoughtId] = useState<string | null>(null)
  const [levelUpMsg, setLevelUpMsg] = useState<string | null>(null)

  const level = calcLevel(profile.totalPoints)

  function handleBuy(item: RewardItem) {
    const newPoints = profile.totalPoints - item.unlockCost
    const newLevel = calcLevel(newPoints)
    save({
      ...snapshot,
      profile: {
        ...profile,
        totalPoints: newPoints,
        unlockedItemIds: [...profile.unlockedItemIds, item.id],
        level: newLevel,
      },
    })
    setConfirmItem(null)
    setJustBoughtId(item.id)
    setTimeout(() => setJustBoughtId(null), 1500)
    if (newLevel > level) {
      setLevelUpMsg(`🎉 Lv.${newLevel} にレベルアップ！`)
      setTimeout(() => setLevelUpMsg(null), 3000)
    }
  }

  function handleToggleEquip(item: RewardItem) {
    const isEquipped = profile.equippedItemIds.includes(item.id)
    const sameCatIds = rewardItems.filter(r => r.category === item.category).map(r => r.id)
    const newEquipped = isEquipped
      ? profile.equippedItemIds.filter(id => id !== item.id)
      : [...profile.equippedItemIds.filter(id => !sameCatIds.includes(id)), item.id]
    save({ ...snapshot, profile: { ...profile, equippedItemIds: newEquipped } })
  }

  const categories = ['weapon', 'armor', 'friend', 'costume', 'background'] as const

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Level-up notification */}
      <AnimatePresence>
        {levelUpMsg && (
          <motion.div
            key="levelup"
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
            className="fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded border-4 border-pixel-gold bg-pixel-panel px-6 py-3 font-pixel text-sm text-pixel-gold"
            style={{ boxShadow: '4px 4px 0 #05050a' }}
          >
            {levelUpMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase confirmation */}
      <AnimatePresence>
        {confirmItem && (
          <ConfirmDialog
            item={confirmItem}
            currentPoints={profile.totalPoints}
            onConfirm={() => handleBuy(confirmItem)}
            onCancel={() => setConfirmItem(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-3xl text-pixel-gold">プロフィール</h1>
        <Link to="/game/map"><PixelButton className="text-xs">← マップ</PixelButton></Link>
      </div>

      {/* Player stats */}
      <PixelPanel className="space-y-4">
        <p className="font-pixel text-xl text-pixel-cream">{profile.displayName}</p>
        <LevelBar totalPoints={profile.totalPoints} />
        <div className="flex gap-6 pt-1 text-center">
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">TOTAL POINTS</p>
            <p className="font-pixel text-2xl text-pixel-gold">{profile.totalPoints}</p>
          </div>
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">ステージクリア</p>
            <p className="font-pixel text-2xl text-pixel-green">
              {new Set(snapshot.sessions.filter(s => s.cleared).map(s => s.stageId)).size}
            </p>
          </div>
        </div>
      </PixelPanel>

      {/* Equipped items summary */}
      <EquippedPanel equippedIds={profile.equippedItemIds} />

      {/* Item shop */}
      <PixelPanel className="space-y-5">
        <h2 className="font-pixel text-lg text-pixel-gold">アイテム</h2>
        {categories.map(cat => {
          const catItems = rewardItems.filter(item => item.category === cat)
          return (
            <div key={cat} className="space-y-2">
              <p className="font-pixel text-xs text-pixel-cream/60">{CAT_LABEL[cat]}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {catItems.map(item => {
                  const unlocked = profile.unlockedItemIds.includes(item.id)
                  const equipped = profile.equippedItemIds.includes(item.id)
                  const canAfford = profile.totalPoints >= item.unlockCost
                  const justBought = justBoughtId === item.id
                  return (
                    <motion.div
                      key={item.id}
                      animate={justBought ? { scale: [1, 1.06, 1] } : {}}
                      transition={{ duration: 0.8 }}
                      className={`space-y-2 rounded border-2 p-3 text-xs ${
                        equipped ? 'border-pixel-gold bg-pixel-panel'
                          : unlocked ? 'border-pixel-cream/30 bg-pixel-panel'
                          : 'border-pixel-cream/15 bg-pixel-night'
                      }`}
                    >
                      <div>
                        <p className={`font-pixel ${unlocked ? 'text-pixel-cream' : 'text-pixel-cream/40'}`}>
                          {equipped && '✓ '}{item.name}
                        </p>
                        <p className="mt-0.5 text-pixel-cream/50">{item.description}</p>
                        {item.attackStyle && (
                          <p className="mt-0.5 font-pixel text-pixel-cream/30">⚡ {item.attackStyle.label}</p>
                        )}
                      </div>
                      {!unlocked && (
                        <button
                          disabled={!canAfford}
                          onClick={() => canAfford && setConfirmItem(item)}
                          className={`w-full rounded px-2 py-1 font-pixel text-xs ${
                            canAfford
                              ? 'cursor-pointer bg-pixel-gold text-pixel-night hover:opacity-90'
                              : 'cursor-not-allowed border border-pixel-cream/20 text-pixel-cream/30'
                          }`}
                        >
                          {canAfford ? `買う！ (${item.unlockCost}pt)` : `あと ${item.unlockCost - profile.totalPoints}pt`}
                        </button>
                      )}
                      {unlocked && (
                        <button
                          onClick={() => handleToggleEquip(item)}
                          className={`w-full rounded border px-2 py-1 font-pixel text-xs ${
                            equipped
                              ? 'border-pixel-gold text-pixel-gold'
                              : 'border-pixel-cream/30 text-pixel-cream/60 hover:border-pixel-green hover:text-pixel-green'
                          }`}
                        >
                          {equipped ? 'はずす' : 'つかう'}
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </PixelPanel>

      {/* Achievements */}
      <PixelPanel className="space-y-4">
        <h2 className="font-pixel text-lg text-pixel-gold">🏆 実績</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievementDefs.map(def => {
            const state = achievements.find(a => a.achievementId === def.id)
            const earned = state?.unlockedAt !== null && state?.unlockedAt !== undefined
            return (
              <div key={def.id} className={`rounded border-2 p-3 text-center ${
                earned ? 'border-pixel-gold bg-pixel-panel' : 'border-pixel-cream/20 bg-pixel-night opacity-50'
              }`}>
                <p className={`font-pixel text-sm ${earned ? 'text-pixel-gold' : 'text-pixel-cream/40'}`}>
                  {earned ? '🎖️' : '□'} {def.name}
                </p>
                <p className="mt-1 text-xs text-pixel-cream/50">{def.description}</p>
                {earned && state?.unlockedAt && (
                  <p className="mt-1 text-xs text-pixel-cream/30">{state.unlockedAt.slice(0, 10)}</p>
                )}
              </div>
            )
          })}
        </div>
      </PixelPanel>
    </div>
  )
}
