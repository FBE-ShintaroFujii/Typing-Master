import type { ZombieSpeed } from '../types/index.ts'

// ── Types ────────────────────────────────────────────────────────────────────

export type GamePhase = 'idle' | 'playing' | 'clear' | 'gameover'

export interface GameLoopState {
  phase: GamePhase
  /** Zombie proximity: 1.0 = far away (safe), 0.0 = reached player (game over). */
  zombieDistance: number
  /** Index of the prompt currently being typed. */
  promptIndex: number
  /** Total individual keys typed (correct + mistakes). */
  typedChars: number
  /** Correct keys typed. */
  correctChars: number
  /** Count of wrong keystrokes. */
  mistakeCount: number
  /** `performance.now()` timestamp when playing started, or null. */
  startedAt: number | null
  /** `performance.now()` timestamp when the game ended (clear/gameover). */
  endedAt: number | null
}

export const initialGameLoopState: GameLoopState = {
  phase: 'idle',
  zombieDistance: 1,
  promptIndex: 0,
  typedChars: 0,
  correctChars: 0,
  mistakeCount: 0,
  startedAt: null,
  endedAt: null,
}

// ── Zombie speed config ──────────────────────────────────────────────────────

/**
 * Distance units the zombie advances *per second* for each speed tier.
 * The full range is 0.0–1.0, so a value of 0.04 means ~25 s to cross at normal speed.
 */
export const ZOMBIE_SPEED_PER_SECOND: Readonly<Record<ZombieSpeed, number>> = {
  none: 0,
  slow: 0.025,
  normal: 0.042,
  fast: 0.065,
}

/** How much the zombie retreats on each correct keystroke. */
export const ZOMBIE_RETREAT_PER_CORRECT = 0.04

/** Extra retreat when a whole prompt word is completed. */
export const ZOMBIE_RETREAT_PER_WORD = 0.08

// ── Actions ──────────────────────────────────────────────────────────────────

export type GameLoopAction =
  | { type: 'start'; now: number }
  | { type: 'correct'; now?: number }
  | { type: 'mistake' }
  | { type: 'wordComplete' }
  | { type: 'tick'; deltaSeconds: number }
  | { type: 'clear'; now: number }
  | { type: 'gameover'; now: number }
  | { type: 'reset' }

// ── Reducer ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Pure reducer for the game loop.
 * All side-effects (RAF, audio, navigation) live in the UI layer.
 */
export function gameLoopReducer(state: GameLoopState, action: GameLoopAction): GameLoopState {
  switch (action.type) {
    case 'start':
      return {
        ...initialGameLoopState,
        phase: 'playing',
        startedAt: action.now,
      }

    case 'correct':
      return {
        ...state,
        typedChars: state.typedChars + 1,
        correctChars: state.correctChars + 1,
        zombieDistance: clamp(state.zombieDistance + ZOMBIE_RETREAT_PER_CORRECT, 0, 1),
      }

    case 'mistake':
      return {
        ...state,
        typedChars: state.typedChars + 1,
        mistakeCount: state.mistakeCount + 1,
      }

    case 'wordComplete':
      return {
        ...state,
        promptIndex: state.promptIndex + 1,
        zombieDistance: clamp(state.zombieDistance + ZOMBIE_RETREAT_PER_WORD, 0, 1),
      }

    case 'tick': {
      if (state.phase !== 'playing') return state
      const next = state.zombieDistance - action.deltaSeconds
      if (next <= 0) {
        return { ...state, zombieDistance: 0 }
      }
      return { ...state, zombieDistance: next }
    }

    case 'clear':
      return { ...state, phase: 'clear', endedAt: action.now }

    case 'gameover':
      return { ...state, phase: 'gameover', zombieDistance: 0, endedAt: action.now }

    case 'reset':
      return { ...initialGameLoopState }

    default:
      return state
  }
}

// ── Derived helpers ───────────────────────────────────────────────────────────

/** Elapsed seconds since the game started (0 if not started). */
export function getElapsedSeconds(state: GameLoopState, now: number): number {
  if (!state.startedAt) return 0
  const end = state.endedAt ?? now
  return (end - state.startedAt) / 1000
}

/** Danger tier for UI color coding. */
export type DangerTier = 'safe' | 'warn' | 'danger'

export function getDangerTier(zombieDistance: number): DangerTier {
  if (zombieDistance > 0.55) return 'safe'
  if (zombieDistance > 0.25) return 'warn'
  return 'danger'
}
