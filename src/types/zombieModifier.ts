/** Gameplay modifier applied to zombie behavior based on equipped items. */
export interface ZombieModifier {
  /**
   * Multiplier applied to the zombie's advance speed.
   * 0.7 = 30 % slower than normal. Default: 1.0 (no change).
   * Multiple armor items are multiplied together.
   */
  speedMultiplier: number
  /**
   * Extra zombieDistance added per correct keystroke.
   * Stacks additively across companions / costumes.
   * Default: 0.
   */
  retreatBonus: number
  /**
   * Extra zombieDistance added when a whole prompt word is completed.
   * Default: 0.
   */
  wordRetreatBonus: number
}

/** No-item baseline — equivalent to wearing nothing. */
export const DEFAULT_ZOMBIE_MODIFIER: ZombieModifier = {
  speedMultiplier: 1.0,
  retreatBonus: 0,
  wordRetreatBonus: 0,
}
