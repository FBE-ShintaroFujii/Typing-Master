import type { AppDataSnapshot } from '../../data/repository.ts'
import { achievements as achievementDefs } from '../../content/achievements.ts'
import { stageDefinitions } from '../../content/stages.ts'
import type { SessionRecord } from '../../types/progress.ts'
import type { AchievementConditionType } from '../../types/achievement.ts'

// ── Condition evaluators ──────────────────────────────────────────────────────

function evaluateCondition(
  conditionType: AchievementConditionType,
  target: number,
  sessions: SessionRecord[],
  retryCount: number,
): boolean {
  switch (conditionType) {
    case 'firstStageClear':
      return sessions.some((s) => s.cleared)

    case 'retryCount':
      return retryCount >= target

    case 'speedTarget':
      return sessions.some((s) => s.charsPerMinute >= target)

    case 'streakDays': {
      // Find the longest streak of consecutive calendar days with at least one session.
      const dateSet = new Set(sessions.map((s) => s.completedAt.slice(0, 10)))
      if (dateSet.size === 0) return false
      const sorted = [...dateSet].sort() // ISO strings sort chronologically

      let maxStreak = 1
      let streak = 1

      for (let i = 1; i < sorted.length; i++) {
        const prevStr = sorted[i - 1]
        const currStr = sorted[i]
        if (!prevStr || !currStr) continue

        // Compute the day after prevStr in UTC
        const nextDay = new Date(prevStr + 'T00:00:00Z')
        nextDay.setUTCDate(nextDay.getUTCDate() + 1)
        const nextStr = nextDay.toISOString().slice(0, 10)

        if (currStr === nextStr) {
          streak++
          if (streak > maxStreak) maxStreak = streak
        } else {
          streak = 1
        }
      }

      return maxStreak >= target
    }

    case 'freeInputCount': {
      const freeSessions = sessions.filter(
        (s) => s.stageId === 'lv-7-free-input' && s.cleared,
      )
      return freeSessions.length >= target
    }

    case 'phaseOneClear': {
      const clearedIds = new Set(sessions.filter((s) => s.cleared).map((s) => s.stageId))
      return stageDefinitions.every((s) => clearedIds.has(s.id))
    }

    case 'phaseTwoUnlocked':
      // Phase 2 stages are not yet implemented.
      return false
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Evaluate all achievement conditions against the current snapshot and return
 * the IDs of achievements that are newly unlocked (not already unlocked).
 *
 * Pure function — no side effects.
 */
export function checkAchievements(snapshot: AppDataSnapshot): string[] {
  const newIds: string[] = []

  for (const def of achievementDefs) {
    // Skip achievements that are already unlocked
    const existing = snapshot.achievements.find((a) => a.achievementId === def.id)
    if (existing?.unlockedAt !== null && existing?.unlockedAt !== undefined) continue

    if (evaluateCondition(def.conditionType, def.target, snapshot.sessions, snapshot.retryCount)) {
      newIds.push(def.id)
    }
  }

  return newIds
}

/**
 * Return a new snapshot with the given achievement IDs marked as unlocked now.
 * Creates new AchievementState records for IDs that have no existing record.
 */
export function applyNewAchievements(
  snapshot: AppDataSnapshot,
  newIds: string[],
): AppDataSnapshot {
  if (newIds.length === 0) return snapshot

  const now = new Date().toISOString()
  const existingIds = new Set(snapshot.achievements.map((a) => a.achievementId))

  return {
    ...snapshot,
    achievements: [
      // Update unlockedAt on any existing records
      ...snapshot.achievements.map((a) =>
        newIds.includes(a.achievementId) ? { ...a, unlockedAt: now } : a,
      ),
      // Create new records for IDs that had no record yet
      ...newIds
        .filter((id) => !existingIds.has(id))
        .map((id) => ({ achievementId: id, unlockedAt: now, progress: 1 })),
    ],
  }
}
