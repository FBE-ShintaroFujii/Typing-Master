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
  private readonly key: string

  /** Pass a player-specific key to scope data per player. Defaults to global STORAGE_KEY. */
  constructor(storageKey: string = STORAGE_KEY) {
    this.key = storageKey
  }

  load(): AppDataSnapshot {
    const raw = window.localStorage.getItem(this.key)
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
    window.localStorage.setItem(this.key, JSON.stringify(snapshot))
  }

  reset(): void {
    window.localStorage.removeItem(this.key)
  }
}
