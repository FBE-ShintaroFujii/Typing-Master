import { useEffect, useState } from 'react'

/**
 * Animates a number from 0 to `target` over `duration` ms with an ease-out curve.
 * Returns the current animated value (integer).
 */
export function useCountUp(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) return
    let handle = 0
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        handle = requestAnimationFrame(tick)
      }
    }
    handle = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(handle)
  }, [target, duration])

  return current
}
