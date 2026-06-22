import { act, renderHook } from '@testing-library/react'
import { useAppData } from './useAppData.ts'
import { STORAGE_KEY } from '../data/index.ts'

beforeEach(() => {
  localStorage.clear()
})

describe('useAppData', () => {
  it('loads the default snapshot when localStorage is empty', () => {
    const { result } = renderHook(() => useAppData())
    expect(result.current.snapshot.profile.level).toBe(1)
    expect(result.current.snapshot.sessions).toHaveLength(0)
    expect(result.current.snapshot.schemaVersion).toBe(1)
  })

  it('save() persists the snapshot and updates state', () => {
    const { result } = renderHook(() => useAppData())
    act(() => {
      result.current.save({ ...result.current.snapshot, retryCount: 7 })
    })
    expect(result.current.snapshot.retryCount).toBe(7)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      retryCount: number
    }
    expect(stored.retryCount).toBe(7)
  })

  it('loads existing snapshot from localStorage on mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, retryCount: 3, profile: {}, sessions: [], achievements: [], parentMessages: [], settings: {} }),
    )
    const { result } = renderHook(() => useAppData())
    expect(result.current.snapshot.retryCount).toBe(3)
  })
})
