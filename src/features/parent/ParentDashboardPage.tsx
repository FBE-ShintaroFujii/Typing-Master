import { Link } from 'react-router-dom'
import { stageDefinitions } from '../../content/index.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'
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
        <h1 className="text-2xl font-bold text-pixel-gold">おとうさんダッシュボード</h1>
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
