import type { SessionRecord } from '../../types/index.ts'

export interface DailyChartPoint {
  date: string // "MM/DD" for chart X-axis
  practiceMinutes: number
  averageCpm: number
  averageAccuracy: number
  sessions: number
}

export interface PeriodSummary {
  totalSeconds: number
  totalChars: number
  sessionCount: number
  averageAccuracy: number
  averageCpm: number
}

/** Aggregate sessions into daily data points for the last `days` days. */
export function aggregateDailyPoints(sessions: SessionRecord[], days: number): DailyChartPoint[] {
  const result: DailyChartPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().slice(0, 10) // "YYYY-MM-DD"
    const label = dateKey.slice(5).replace('-', '/') // "MM/DD"

    const daySessions = sessions.filter(s => s.startedAt.slice(0, 10) === dateKey)
    const count = daySessions.length
    const practiceSeconds = daySessions.reduce((acc, s) => acc + s.durationSeconds, 0)
    const cpmSum = daySessions.reduce((acc, s) => acc + s.charsPerMinute, 0)
    const accuracySum = daySessions.reduce((acc, s) => acc + s.accuracy, 0)

    result.push({
      date: label,
      practiceMinutes: Math.round((practiceSeconds / 60) * 10) / 10,
      averageCpm: count > 0 ? Math.round(cpmSum / count) : 0,
      averageAccuracy: count > 0 ? Math.round(accuracySum / count) : 0,
      sessions: count,
    })
  }

  return result
}

/** Get a summary over the past `days` days. */
export function getPeriodSummary(sessions: SessionRecord[], days: number): PeriodSummary {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const filtered = sessions.filter(s => new Date(s.startedAt) >= cutoff)
  const count = filtered.length

  return {
    totalSeconds: filtered.reduce((acc, s) => acc + s.durationSeconds, 0),
    totalChars: filtered.reduce((acc, s) => acc + s.typedChars, 0),
    sessionCount: count,
    averageAccuracy:
      count > 0 ? Math.round(filtered.reduce((acc, s) => acc + s.accuracy, 0) / count) : 0,
    averageCpm:
      count > 0 ? Math.round(filtered.reduce((acc, s) => acc + s.charsPerMinute, 0) / count) : 0,
  }
}

/** Get a summary for today only. */
export function getTodaySummary(sessions: SessionRecord[]): PeriodSummary {
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.startedAt.slice(0, 10) === today)
  const count = todaySessions.length

  return {
    totalSeconds: todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0),
    totalChars: todaySessions.reduce((acc, s) => acc + s.typedChars, 0),
    sessionCount: count,
    averageAccuracy:
      count > 0 ? Math.round(todaySessions.reduce((acc, s) => acc + s.accuracy, 0) / count) : 0,
    averageCpm:
      count > 0 ? Math.round(todaySessions.reduce((acc, s) => acc + s.charsPerMinute, 0) / count) : 0,
  }
}

/**
 * Find the stageId the child is currently stuck on: the most recently attempted
 * stage that was not cleared.  Falls back to the most recently played stage.
 */
export function getStuckStageId(sessions: SessionRecord[]): string | null {
  if (sessions.length === 0) return null
  const sorted = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  const notCleared = sorted.find(s => !s.cleared)
  return (notCleared ?? sorted[0])?.stageId ?? null
}

/** Format a duration in seconds as "X分Y秒". */
export function formatSeconds(totalSeconds: number): string {
  if (totalSeconds === 0) return '0分'
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  if (m === 0) return `${s}秒`
  if (s === 0) return `${m}分`
  return `${m}分${s}秒`
}

/** Format an ISO timestamp as "YYYY/MM/DD HH:MM". */
export function formatDateTime(isoString: string): string {
  const d = new Date(isoString)
  const ymd = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${ymd} ${hm}`
}
