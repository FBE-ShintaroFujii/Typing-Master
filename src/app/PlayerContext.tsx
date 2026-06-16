import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PlayerEntry } from '../types/player.ts'
import {
  getPlayerStorageKey,
  loadPlayerList,
  savePlayerList,
} from '../data/playerStorage.ts'
import { STORAGE_KEY } from '../data/defaults.ts'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerContextValue {
  /** Currently selected player, or null if none selected yet. */
  currentPlayer: PlayerEntry | null
  /** localStorage key for the current player's game data. */
  storageKey: string
  /** All registered players. */
  players: PlayerEntry[]
  selectPlayer: (player: PlayerEntry) => void
  addPlayer: (name: string, avatar: string) => PlayerEntry
  removePlayer: (name: string) => void
  /** Clear the current selection (return to player-select screen). */
  clearSelection: () => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const PlayerContext = createContext<PlayerContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<PlayerEntry[]>(() => loadPlayerList())
  const [currentPlayer, setCurrentPlayer] = useState<PlayerEntry | null>(null)

  const storageKey = currentPlayer
    ? getPlayerStorageKey(currentPlayer.name)
    : STORAGE_KEY // fallback (only used if navigating without selecting — edge case)

  function selectPlayer(player: PlayerEntry) {
    const now = new Date().toISOString()
    const updated = players.map((p) =>
      p.name === player.name ? { ...p, lastPlayedAt: now } : p,
    )
    savePlayerList(updated)
    setPlayers(updated)
    setCurrentPlayer({ ...player, lastPlayedAt: now })
  }

  function addPlayer(name: string, avatar: string): PlayerEntry {
    const now = new Date().toISOString()
    const entry: PlayerEntry = { name, avatar, createdAt: now, lastPlayedAt: now }
    const updated = [...players, entry]
    savePlayerList(updated)
    setPlayers(updated)
    return entry
  }

  function removePlayer(name: string) {
    const updated = players.filter((p) => p.name !== name)
    savePlayerList(updated)
    setPlayers(updated)
    window.localStorage.removeItem(getPlayerStorageKey(name))
    if (currentPlayer?.name === name) setCurrentPlayer(null)
  }

  function clearSelection() {
    setCurrentPlayer(null)
  }

  return (
    <PlayerContext.Provider
      value={{ currentPlayer, storageKey, players, selectPlayer, addPlayer, removePlayer, clearSelection }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayerContext must be used inside <PlayerProvider>')
  return ctx
}
