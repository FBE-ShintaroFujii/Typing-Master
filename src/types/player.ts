import type { AttackStyle } from './attack.ts'

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
}
