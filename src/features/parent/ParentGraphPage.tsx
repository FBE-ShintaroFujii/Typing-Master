import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PixelButton, PixelPanel } from '../../design/index.ts'
import type { DailyChartPoint } from './parentUtils.ts'
import { aggregateDailyPoints } from './parentUtils.ts'
import { useParentData } from './useParentData.ts'

type Period = 7 | 30

const TOOLTIP_CONTENT_STYLE = {
  background: '#171725',
  border: '2px solid #f8f2d8',
  padding: '8px 12px',
  borderRadius: 0,
} as const

interface ChartCardProps {
  title: string
  data: DailyChartPoint[]
  dataKey: keyof Omit<DailyChartPoint, 'date'>
  color: string
  unit: string
  period: Period
}

function ChartCard({ title, data, dataKey, color, unit, period }: ChartCardProps) {
  const interval = period === 7 ? 0 : 4
  return (
    <PixelPanel>
      <h2 className="mb-3 text-sm font-bold text-pixel-cream">{title}</h2>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#f8f2d8', fontSize: 10 }}
            tickLine={false}
            interval={interval}
          />
          <YAxis
            tick={{ fill: '#f8f2d8', fontSize: 10 }}
            tickLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={{ color: '#ffd166', fontSize: 11 }}
            itemStyle={{ color, fontSize: 11 }}
            formatter={(value) => [`${String(value)}${unit}`, title]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </PixelPanel>
  )
}

export function ParentGraphPage() {
  const [period, setPeriod] = useState<Period>(7)
  const { snapshot } = useParentData()
  const data = aggregateDailyPoints(snapshot.sessions, period)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pixel-gold">詳細グラフ</h1>
        <Link to="/parent/dashboard">
          <PixelButton>← 戻る</PixelButton>
        </Link>
      </div>

      {/* Period selector */}
      <div className="flex gap-3">
        <PixelButton
          onClick={() => setPeriod(7)}
          className={period === 7 ? 'bg-pixel-purple' : ''}
        >
          過去7日
        </PixelButton>
        <PixelButton
          onClick={() => setPeriod(30)}
          className={period === 30 ? 'bg-pixel-purple' : ''}
        >
          過去30日
        </PixelButton>
      </div>

      <ChartCard
        title="日別練習時間（分）"
        data={data}
        dataKey="practiceMinutes"
        color="#ffd166"
        unit="分"
        period={period}
      />
      <ChartCard
        title="日別CPM（文字/分）"
        data={data}
        dataKey="averageCpm"
        color="#78d64b"
        unit=""
        period={period}
      />
      <ChartCard
        title="日別正確率（%）"
        data={data}
        dataKey="averageAccuracy"
        color="#8b5cf6"
        unit="%"
        period={period}
      />
    </div>
  )
}
