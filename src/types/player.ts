import type { AttackStyle } from './attack.ts'
import type { ZombieModifier } from './zombieModifier.ts'

export type UserMode = 'child' | 'parent'

export interface PlayerProfile {
  id: string
  displayName: string
  level: number
  totalPoints: number
  skill: number
  equippedItemIds: string[]
  unlockedItemIds: string[]
  createdAt: string
  updatedAt: string
}

export interface RewardItem {
  id: string
  name: string
  category: 'weapon' | 'armor' | 'friend' | 'costume' | 'background'
  unlockCost: number
  description: string
  /** Optional custom attack effect shown when this weapon is equipped. */
  attackStyle?: AttackStyle
  /** Optional zombie behavior modifier applied while this item is equipped. */
  zombieModifier?: ZombieModifier
}
