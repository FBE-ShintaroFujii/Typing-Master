import { rewardItems } from '../../content/items.ts'
import type { ZombieModifier } from '../../types/zombieModifier.ts'

/**
 * Compute the combined ZombieModifier for the given set of equipped item IDs.
 *
 * - `speedMultiplier` values are **multiplied** together (diminishing returns).
 * - `retreatBonus` and `wordRetreatBonus` are **summed** across items.
 *
 * Returns DEFAULT_ZOMBIE_MODIFIER-equivalent when no item has a zombieModifier.
 */
export function getZombieModifier(equippedIds: string[]): ZombieModifier {
  let speedMultiplier = 1.0
  let retreatBonus = 0
  let wordRetreatBonus = 0

  for (const id of equippedIds) {
    const item = rewardItems.find((r) => r.id === id)
    if (!item?.zombieModifier) continue
    speedMultiplier *= item.zombieModifier.speedMultiplier
    retreatBonus += item.zombieModifier.retreatBonus
    wordRetreatBonus += item.zombieModifier.wordRetreatBonus
  }

  return { speedMultiplier, retreatBonus, wordRetreatBonus }
}
