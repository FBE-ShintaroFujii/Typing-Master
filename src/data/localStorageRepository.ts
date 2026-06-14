import { createDefaultSnapshot, STORAGE_KEY } from './defaults.ts'
import type { AppDataSnapshot, ProgressRepository } from './repository.ts'

function isSnapshot(value: unknown): value is AppDataSnapshot {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'schemaVersion' in value &&
      (value as { schemaVersion: unknown }).schemaVersion === 1,
  )
}

export class LocalStorageProgressRepository implements ProgressRepository {
  load(): AppDataSnapshot {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createDefaultSnapshot()
    }

    try {
      const parsed: unknown = JSON.parse(raw)
      return isSnapshot(parsed) ? parsed : createDefaultSnapshot()
    } catch {
      return createDefaultSnapshot()
    }
  }

  save(snapshot: AppDataSnapshot): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }

  reset(): void {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}
