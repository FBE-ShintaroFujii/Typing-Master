import { useState } from 'react'
import { Link } from 'react-router-dom'
import { stageDefinitions } from '../../content/index.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'
import { usePlayerContext } from '../../app/PlayerContext.tsx'
import { getPlayerStorageKey } from '../../data/playerStorage.ts'
import type { AppDataSnapshot } from '../../data/repository.ts'
import { formatDateTime, formatSeconds, getPeriodSummary, getStuckStageId, getTodaySummary } from './parentUtils.ts'
import { useParentData } from './useParentData.ts'

interface SummaryCardProps {
  label: string
  value: string
  sub?: string
}

function SummaryCard({ label, value, sub }: SummaryCardProps) {
  return (
    <div className="rounded bg-pixel-night p-4 text-center">
      <div className="text-xs text-pixel-gold">{label}</div>
      <div className="mt-1 text-xl font-bold text-pixel-cream">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-pixel-cream/50">{sub}</div>}
    </div>
  )
}

export function ParentDashboardPage() {
  const { snapshot } = useParentData()
  const { profile, sessions, parentMessages } = snapshot

  const today = getTodaySummary(sessions)
  const week = getPeriodSummary(sessions, 7)
  const stuckId = getStuckStageId(sessions)
  const stuckStage = stageDefinitions.find(s => s.id === stuckId)
  const unreadCount = parentMessages.filter(m => m.readAt === null).length

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pixel-gold">おやごさんダッシュボード</h1>
        <Link to="/"><PixelButton>← もどる</PixelButton></Link>
      </div>

      {/* Today */}
      <PixelPanel>
        <h2 className="mb-3 text-base font-bold text-pixel-cream">今日の練習</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="練習時間" value={formatSeconds(today.totalSeconds)} />
          <SummaryCard label="入力文字数" value={`${today.totalChars}文字`} />
          <SummaryCard
            label="正確率"
            value={today.sessionCount > 0 ? `${today.averageAccuracy}%` : '—'}
          />
          <SummaryCard label="セッション数" value={`${today.sessionCount}回`} />
        </div>
      </PixelPanel>

      {/* Past 7 days */}
      <PixelPanel>
        <h2 className="mb-3 text-base font-bold text-pixel-cream">過去7日間</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="合計練習時間" value={formatSeconds(week.totalSeconds)} />
          <SummaryCard label="合計文字数" value={`${week.totalChars}文字`} />
          <SummaryCard
            label="平均正確率"
            value={week.sessionCount > 0 ? `${week.averageAccuracy}%` : '—'}
          />
          <SummaryCard
            label="平均CPM"
            value={week.sessionCount > 0 ? `${week.averageCpm}` : '—'}
            sub="文字/分"
          />
        </div>
      </PixelPanel>

      {/* Player status */}
      <PixelPanel>
        <h2 className="mb-3 text-base font-bold text-pixel-cream">こどもの状況</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-pixel-gold">現在レベル</dt>
            <dd className="text-pixel-cream">Lv.{profile.level}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-pixel-gold">合計ポイント</dt>
            <dd className="text-pixel-cream">{profile.totalPoints} pt</dd>
          </div>
          {stuckStage && (
            <div className="flex justify-between">
              <dt className="text-pixel-gold">取り組んでいるステージ</dt>
              <dd className="text-pixel-cream">{stuckStage.title}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-pixel-gold">最終アクセス</dt>
            <dd className="text-pixel-cream">{formatDateTime(profile.updatedAt)}</dd>
          </div>
        </dl>
      </PixelPanel>

      {/* Player management */}
      <PlayerManagementPanel />

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <Link to="/parent/graph">
          <PixelButton>詳細グラフ</PixelButton>
        </Link>
        <Link to="/parent/message">
          <PixelButton>
            メッセージ{unreadCount > 0 ? `（未読 ${unreadCount}件）` : ''}
          </PixelButton>
        </Link>
      </div>
    </div>
  )
}

function PlayerManagementPanel() {
  const { players, removePlayer } = usePlayerContext()
  const [confirmName, setConfirmName] = useState<string | null>(null)

  if (players.length === 0) {
    return (
      <PixelPanel>
        <h2 className="mb-2 text-base font-bold text-pixel-cream">👤 プレイヤー一覧</h2>
        <p className="text-sm text-pixel-cream/60">まだプレイヤーが登録されていません。</p>
      </PixelPanel>
    )
  }

  return (
    <PixelPanel className="space-y-4">
      <h2 className="text-base font-bold text-pixel-cream">👤 プレイヤー一覧</h2>
      <div className="space-y-2">
        {players.map((p) => {
          const key = getPlayerStorageKey(p.name)
          let pts = 0
          try {
            const raw = window.localStorage.getItem(key)
            if (raw) {
              const snap = JSON.parse(raw) as AppDataSnapshot
              pts = snap.profile.totalPoints
            }
          } catch { /* ignore */ }

          return (
            <div key={p.name} className="flex items-center justify-between rounded bg-pixel-night px-4 py-3 text-sm">
              <span className="font-pixel text-pixel-cream">{p.avatar} {p.name}</span>
              <span className="text-pixel-cream/60">{pts} pt</span>
              <span className="text-pixel-cream/40">最終: {p.lastPlayedAt.slice(0, 10)}</span>
              <button
                onClick={() => setConfirmName(p.name)}
                className="rounded border border-pixel-red/40 px-2 py-0.5 font-pixel text-xs text-pixel-red/70 hover:border-pixel-red hover:text-pixel-red"
              >削除</button>
            </div>
          )
        })}
      </div>

      {/* Delete confirmation */}
      {confirmName && (
        <div className="space-y-3 rounded border-2 border-pixel-red/40 bg-pixel-night p-4 text-center">
          <p className="font-pixel text-sm text-pixel-cream">{confirmName} のデータを削除しますか？</p>
          <p className="text-xs text-pixel-red/70">この操作は元に戻せません。</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setConfirmName(null)}
              className="border-2 border-pixel-cream/30 px-4 py-1.5 font-pixel text-xs text-pixel-cream/60 hover:border-pixel-cream">やめる</button>
            <button onClick={() => { removePlayer(confirmName); setConfirmName(null) }}
              className="bg-pixel-red px-4 py-1.5 font-pixel text-xs text-pixel-cream hover:opacity-90">削除する</button>
          </div>
        </div>
      )}
    </PixelPanel>
  )
}
