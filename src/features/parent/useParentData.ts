import { useCallback, useState } from 'react'
import type { AppDataSnapshot } from '../../data/index.ts'
import { LocalStorageProgressRepository } from '../../data/localStorageRepository.ts'

const repo = new LocalStorageProgressRepository()

/** Load the app snapshot from localStorage and expose a `save` helper. */
export function useParentData() {
  const [snapshot, setSnapshot] = useState<AppDataSnapshot>(() => repo.load())

  const save = useCallback((updated: AppDataSnapshot) => {
    repo.save(updated)
    setSnapshot(updated)
  }, [])

  return { snapshot, save }
}
