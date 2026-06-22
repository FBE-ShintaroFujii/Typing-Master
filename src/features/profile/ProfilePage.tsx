import { Link } from 'react-router-dom'
import { achievements as achievementDefs, rewardItems } from '../../content/index.ts'
import { useAppData } from '../../hooks/useAppData.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'

const CATEGORY_LABELS: Record<string, string> = {
  weapon: '⚔️ ぶき',
  armor: '🛡️ よろい',
  friend: '💖 なかま',
  costume: '👚 コスチューム',
  background: '🌄 バック',
}

function StatBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-pixel text-xs">
        <span className="text-pixel-cream/70">{label}</span>
        <span className="text-pixel-cream">{value}</span>
      </div>
      <div className="h-3 w-full border-2 border-pixel-cream/30 bg-pixel-night">
        <div
          className="h-full bg-pixel-green transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { snapshot } = useAppData()
  const { profile, achievements } = snapshot

  const categories = ['weapon', 'armor', 'friend', 'costume', 'background'] as const

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-3xl text-pixel-gold">プロフィール</h1>
        <Link to="/game/map">
          <PixelButton className="text-xs">← マップ</PixelButton>
        </Link>
      </div>

      {/* Player stats */}
      <PixelPanel className="space-y-4">
        <p className="font-pixel text-xl text-pixel-cream">{profile.displayName}</p>
        <StatBar label="LEVEL" value={profile.level} max={20} />
        <StatBar label="SKILL" value={profile.skill} max={100} />
        <div className="flex gap-6 pt-1 text-center">
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">TOTAL POINTS</p>
            <p className="font-pixel text-2xl text-pixel-gold">{profile.totalPoints}</p>
          </div>
          <div>
            <p className="font-pixel text-xs text-pixel-cream/60">ステージクリア数</p>
            <p className="font-pixel text-2xl text-pixel-green">
              {new Set(snapshot.sessions.filter((s) => s.cleared).map((s) => s.stageId)).size}
            </p>
          </div>
        </div>
      </PixelPanel>

      {/* Items */}
      <PixelPanel className="space-y-4">
        <h2 className="font-pixel text-lg text-pixel-gold">アイテム</h2>
        {categories.map((cat) => {
          const catItems = rewardItems.filter((item) => item.category === cat)
          return (
            <div key={cat} className="space-y-2">
              <p className="font-pixel text-xs text-pixel-cream/60">{CATEGORY_LABELS[cat]}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {catItems.map((item) => {
                  const unlocked = profile.unlockedItemIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`rounded border-2 p-2 text-xs ${
                        unlocked
                          ? 'border-pixel-gold bg-pixel-panel'
                          : 'border-pixel-cream/20 bg-pixel-night opacity-50'
                      }`}
                    >
                      <p className={`font-pixel ${unlocked ? 'text-pixel-cream' : 'text-pixel-cream/40'}`}>
                        {item.name}
                      </p>
                      <p className="text-pixel-cream/50">{item.description}</p>
                      {!unlocked && (
                        <p className="mt-1 font-pixel text-pixel-gold/60">{item.unlockCost}pt</p>
                      )}
                    </div>
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
          {achievementDefs.map((def) => {
            const state = achievements.find((a) => a.achievementId === def.id)
            const earned = state?.unlockedAt !== null && state?.unlockedAt !== undefined
            return (
              <div
                key={def.id}
                className={`rounded border-2 p-3 text-center ${
                  earned
                    ? 'border-pixel-gold bg-pixel-panel'
                    : 'border-pixel-cream/20 bg-pixel-night opacity-50'
                }`}
              >
                <p
                  className={`font-pixel text-sm ${
                    earned ? 'text-pixel-gold' : 'text-pixel-cream/40'
                  }`}
                >
                  {earned ? '🏅' : '□'} {def.name}
                </p>
                <p className="mt-1 text-xs text-pixel-cream/50">{def.description}</p>
                {earned && state?.unlockedAt && (
                  <p className="mt-1 text-xs text-pixel-cream/30">
                    {state.unlockedAt.slice(0, 10)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </PixelPanel>
    </div>
  )
}
