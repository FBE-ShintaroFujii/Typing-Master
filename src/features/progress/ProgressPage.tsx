import { Link } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SessionRecord } from '../../types/index.ts'
import { useAppData } from '../../hooks/useAppData.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'

function getLast7DaysData(sessions: SessionRecord[]) {
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const daySessions = sessions.filter((s) => s.completedAt.startsWith(dateStr))
    const avgCpm =
      daySessions.length > 0
        ? Math.round(
            daySessions.reduce((sum, s) => sum + s.charsPerMinute, 0) / daySessions.length,
          )
        : 0
    result.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, cpm: avgCpm })
  }
  return result
}

export function ProgressPage() {
  const { snapshot } = useAppData()
  const { sessions } = snapshot

  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((s) => s.completedAt.startsWith(todayStr))

  const todayChars = todaySessions.reduce((sum, s) => sum + s.typedChars, 0)
  const todaySeconds = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0)
  const todayAccuracy =
    todaySessions.length > 0
      ? Math.round(
          (todaySessions.reduce((sum, s) => sum + s.accuracy, 0) / todaySessions.length) * 100,
        )
      : 0

  const todayMinutes = Math.floor(todaySeconds / 60)
  const todaySecondsRem = todaySeconds % 60

  const chartData = getLast7DaysData(sessions)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-3xl text-pixel-gold">練習記録</h1>
        <Link to="/game/map">
          <PixelButton className="text-xs">← マップ</PixelButton>
        </Link>
      </div>

      {/* Today's summary */}
      <PixelPanel className="space-y-4">
        <h2 className="font-pixel text-lg text-pixel-cream">📅 きょうの記録</h2>
        {todaySessions.length === 0 ? (
          <p className="text-pixel-cream/60">まだなにもしてないよ！やりにいこう！</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">文字数</p>
              <p className="font-pixel text-2xl text-pixel-gold">{todayChars}</p>
            </div>
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">正確率</p>
              <p className="font-pixel text-2xl text-pixel-green">{todayAccuracy}%</p>
            </div>
            <div>
              <p className="font-pixel text-xs text-pixel-cream/60">練習時間</p>
              <p className="font-pixel text-2xl text-pixel-cream">
                {todayMinutes}分{todaySecondsRem}秒
              </p>
            </div>
          </div>
        )}
      </PixelPanel>

      {/* 7-day CPM chart */}
      <PixelPanel className="space-y-4">
        <h2 className="font-pixel text-lg text-pixel-cream">📈 CPM推移（過去7日）</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(248,242,216,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(248,242,216,0.6)', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: 'rgba(248,242,216,0.2)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(248,242,216,0.6)', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: '#171725',
                border: '2px solid #ffd166',
                borderRadius: 0,
                fontFamily: 'monospace',
                color: '#f8f2d8',
                fontSize: 12,
              }}
              formatter={(value) => [typeof value === 'number' ? `${value} CPM` : value, 'CPM']}
            />
            <Line
              type="monotone"
              dataKey="cpm"
              stroke="#ffd166"
              strokeWidth={2}
              dot={{ fill: '#ffd166', r: 4 }}
              activeDot={{ r: 6, fill: '#78d64b' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-center text-xs text-pixel-cream/40">各日の平均CPM（文字数/分）</p>
      </PixelPanel>

      {/* Session history */}
      <PixelPanel className="space-y-3">
        <h2 className="font-pixel text-lg text-pixel-cream">📝 近い履歴</h2>
        {sessions.length === 0 ? (
          <p className="text-pixel-cream/60">記録がまだありません。</p>
        ) : (
          <div className="space-y-2">
            {[...sessions]
              .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
              .slice(0, 10)
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded border border-pixel-cream/10 bg-pixel-night px-3 py-2 text-xs"
                >
                  <span className="text-pixel-cream/60">{s.completedAt.slice(0, 10)}</span>
                  <span className="font-pixel text-pixel-cream">{s.stageId.slice(0, 12)}…</span>
                  <span className="text-pixel-green">{Math.round(s.charsPerMinute)} CPM</span>
                  <span className="text-pixel-cream/60">{Math.round(s.accuracy * 100)}%</span>
                  <span
                    className={s.cleared ? 'font-pixel text-pixel-green' : 'text-pixel-red'}
                  >
                    {s.cleared ? 'CLEAR' : '-'}
                  </span>
                </div>
              ))}
          </div>
        )}
      </PixelPanel>
    </div>
  )
}
