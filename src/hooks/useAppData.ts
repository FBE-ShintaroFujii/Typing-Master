import { useCallback, useEffect, useMemo, useState } from 'react'
import { LocalStorageProgressRepository } from '../data/index.ts'
import type { AppDataSnapshot } from '../data/index.ts'
import { usePlayerContext } from '../app/PlayerContext.tsx'

/**
 * Provides reactive access to the **current player's** persisted snapshot.
 * Automatically switches data when the selected player changes.
 * All UI must use this hook rather than accessing localStorage directly.
 */
export function useAppData() {
  const { storageKey } = usePlayerContext()
  const repo = useMemo(() => new LocalStorageProgressRepository(storageKey), [storageKey])
  const [snapshot, setSnapshot] = useState<AppDataSnapshot>(() => repo.load())

  // Reload data whenever the repo (= player) changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot(repo.load())
  }, [repo])

  const save = useCallback(
    (next: AppDataSnapshot) => {
      repo.save(next)
      setSnapshot(next)
    },
    [repo],
  )

  return { snapshot, save }
}
