export interface ScoreInput {
  durationSeconds: number
  typedChars: number
  correctChars: number
  mistakeCount: number
  cleared: boolean
}

export interface ScoreResult {
  accuracy: number
  charsPerMinute: number
  points: number
}

export function calculateScore(input: ScoreInput): ScoreResult {
  const durationMinutes = Math.max(input.durationSeconds, 1) / 60
  const accuracy = input.typedChars === 0 ? 1 : input.correctChars / input.typedChars
  const charsPerMinute = input.correctChars / durationMinutes
  const clearBonus = input.cleared ? 50 : 0
  const speedBonus = Math.round(charsPerMinute)
  const accuracyBonus = Math.round(accuracy * 50)

  return {
    accuracy,
    charsPerMinute,
    points: Math.max(0, clearBonus + speedBonus + accuracyBonus - input.mistakeCount * 2),
  }
}
