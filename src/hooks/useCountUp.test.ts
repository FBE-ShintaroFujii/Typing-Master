import { renderHook } from '@testing-library/react'
import { useCountUp } from './useCountUp.ts'

describe('useCountUp', () => {
  it('starts at 0', () => {
    const { result } = renderHook(() => useCountUp(100))
    // Initial render before RAF fires
    expect(result.current).toBe(0)
  })

  it('returns 0 immediately when target is 0', () => {
    const { result } = renderHook(() => useCountUp(0))
    expect(result.current).toBe(0)
  })
})
