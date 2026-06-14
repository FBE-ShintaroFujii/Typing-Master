import type { AppDataSnapshot } from './repository.ts'

export const STORAGE_KEY = 'zombie-typing-determination:v1'

export function createDefaultSnapshot(now = new Date().toISOString()): AppDataSnapshot {
  return {
    schemaVersion: 1,
    profile: {
      id: 'child-player',
      displayName: 'こども',
      level: 1,
      totalPoints: 0,
      skill: 1,
      equippedItemIds: [],
      unlockedItemIds: [],
      createdAt: now,
      updatedAt: now,
    },
    sessions: [],
    achievements: [],
    parentMessages: [],
    settings: {
      bgmVolume: 0.35,
      seVolume: 0.6,
      showRomajiChart: true,
    },
    retryCount: 0,
  }
}
