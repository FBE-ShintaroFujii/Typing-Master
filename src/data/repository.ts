import type {
  AchievementState,
  AppSettings,
  ParentMessage,
  PlayerProfile,
  SessionRecord,
} from '../types/index.ts'

export interface AppDataSnapshot {
  schemaVersion: 1
  profile: PlayerProfile
  sessions: SessionRecord[]
  achievements: AchievementState[]
  parentMessages: ParentMessage[]
  settings: AppSettings
  retryCount: number
}

export interface ProgressRepository {
  load(): AppDataSnapshot
  save(snapshot: AppDataSnapshot): void
  reset(): void
}
