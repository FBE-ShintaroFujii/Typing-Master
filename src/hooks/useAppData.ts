import { useCallback, useMemo, useState } from 'react'
import { LocalStorageProgressRepository } from '../data/index.ts'
import type { AppDataSnapshot } from '../data/index.ts'

/**
 * Provides reactive access to the app's persisted snapshot.
 * All UI must use this hook rather than accessing localStorage directly.
 */
export function useAppData() {
  const repo = useMemo(() => new LocalStorageProgressRepository(), [])
  const [snapshot, setSnapshot] = useState<AppDataSnapshot>(() => repo.load())

  const save = useCallback(
    (next: AppDataSnapshot) => {
      repo.save(next)
      setSnapshot(next)
    },
    [repo],
  )

  return { snapshot, save }
}
