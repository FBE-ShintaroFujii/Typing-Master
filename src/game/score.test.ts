import { calculateScore } from './score.ts'

describe('calculateScore', () => {
  it('treats zero-char sessions as 100% accuracy', () => {
    const result = calculateScore({
      durationSeconds: 60,
      typedChars: 0,
      correctChars: 0,
      mistakeCount: 0,
      cleared: false,
    })
    expect(result.accuracy).toBe(1)
    expect(result.charsPerMinute).toBe(0)
  })

  it('calculates CPM over 60 seconds', () => {
    const result = calculateScore({
      durationSeconds: 60,
      typedChars: 50,
      correctChars: 50,
      mistakeCount: 0,
      cleared: false,
    })
    expect(result.charsPerMinute).toBe(50)
    expect(result.accuracy).toBe(1)
  })

  it('adds clear bonus to points', () => {
    const cleared = calculateScore({
      durationSeconds: 60,
      typedChars: 30,
      correctChars: 30,
      mistakeCount: 0,
      cleared: true,
    })
    const notCleared = calculateScore({
      durationSeconds: 60,
      typedChars: 30,
      correctChars: 30,
      mistakeCount: 0,
      cleared: false,
    })
    expect(cleared.points).toBeGreaterThan(notCleared.points)
  })

  it('deducts points for mistakes', () => {
    const clean = calculateScore({
      durationSeconds: 60,
      typedChars: 30,
      correctChars: 30,
      mistakeCount: 0,
      cleared: false,
    })
    const withMistakes = calculateScore({
      durationSeconds: 60,
      typedChars: 35,
      correctChars: 30,
      mistakeCount: 5,
      cleared: false,
    })
    expect(clean.points).toBeGreaterThan(withMistakes.points)
  })

  it('points are never negative', () => {
    const result = calculateScore({
      durationSeconds: 60,
      typedChars: 10,
      correctChars: 2,
      mistakeCount: 100,
      cleared: false,
    })
    expect(result.points).toBeGreaterThanOrEqual(0)
  })
})
