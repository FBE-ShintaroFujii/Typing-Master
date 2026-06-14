export type AchievementConditionType =
  | 'firstStageClear'
  | 'retryCount'
  | 'speedTarget'
  | 'streakDays'
  | 'freeInputCount'
  | 'phaseOneClear'
  | 'phaseTwoUnlocked'

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  conditionType: AchievementConditionType
  target: number
}

export interface AchievementState {
  achievementId: string
  unlockedAt: string | null
  progress: number
}
