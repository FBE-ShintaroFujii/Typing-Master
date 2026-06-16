import type { AttackStyle } from './attack.ts'
import type { ZombieModifier } from './zombieModifier.ts'

export type UserMode = 'child' | 'parent'

/** A registered player profile shown on the player selection screen. */
export interface PlayerEntry {
  /** Display name (e.g. '太郎'). Used as the storage key discriminator. */
  name: string
  /** Emoji avatar chosen at creation (e.g. '😀'). */
  avatar: string
  createdAt: string
  lastPlayedAt: string
}

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
