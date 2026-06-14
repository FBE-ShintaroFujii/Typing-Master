export interface SessionRecord {
  id: string
  stageId: string
  startedAt: string
  completedAt: string
  durationSeconds: number
  typedChars: number
  correctChars: number
  mistakeCount: number
  accuracy: number
  charsPerMinute: number
  cleared: boolean
  pointsEarned: number
}

export interface DailyProgressSummary {
  date: string
  practiceSeconds: number
  typedChars: number
  averageAccuracy: number
  sessions: number
}
