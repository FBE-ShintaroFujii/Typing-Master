/** Total points required to reach each level (index = level − 1). */
const THRESHOLDS = [
  0,     // Lv 1
  200,   // Lv 2
  500,   // Lv 3
  900,   // Lv 4
  1_400, // Lv 5
  2_000, // Lv 6
  2_700, // Lv 7
  3_500, // Lv 8
  4_400, // Lv 9
  5_400, // Lv 10
] as const

const MAX_LEVEL = THRESHOLDS.length

/** Return the level (1–MAX_LEVEL) for a given total-points value. */
export function calcLevel(totalPoints: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= (THRESHOLDS[i] ?? 0)) return i + 1
  }
  return 1
}

export interface LevelInfo {
  level: number
  nextLevel: number | null
  /** Progress toward the next level (0–1). 1 when at max level. */
  progress: number
  /** Points still needed to reach the next level, or null at max. */
  pointsToNext: number | null
}

/** Detailed level info including progress bar data. */
export function getLevelInfo(totalPoints: number): LevelInfo {
  const level = calcLevel(totalPoints)
  if (level >= MAX_LEVEL) {
    return { level, nextLevel: null, progress: 1, pointsToNext: null }
  }
  const cur = THRESHOLDS[level - 1] ?? 0
  const nxt = THRESHOLDS[level] ?? cur
  const range = nxt - cur
  const progress = range > 0 ? (totalPoints - cur) / range : 1
  return {
    level,
    nextLevel: level + 1,
    progress: Math.min(1, Math.max(0, progress)),
    pointsToNext: nxt - totalPoints,
  }
}
