import type { PlayerEntry } from '../types/player.ts'

export const PLAYERS_LIST_KEY = 'zombie-typing-determination:players'

/** Returns the localStorage key for a specific player's game data. */
export function getPlayerStorageKey(name: string): string {
  return `zombie-typing-determination:player:${name}:v1`
}

export function loadPlayerList(): PlayerEntry[] {
  const raw = window.localStorage.getItem(PLAYERS_LIST_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as PlayerEntry[]
  } catch {
    return []
  }
}

export function savePlayerList(list: PlayerEntry[]): void {
  window.localStorage.setItem(PLAYERS_LIST_KEY, JSON.stringify(list))
}
