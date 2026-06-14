export type GameStatus = 'idle' | 'playing' | 'clear' | 'gameover'

export interface GameState {
  status: GameStatus
  zombieDistance: number
  currentPromptIndex: number
  correctChars: number
  mistakeCount: number
  startedAt: number | null
}

export const initialGameState: GameState = {
  status: 'idle',
  zombieDistance: 1,
  currentPromptIndex: 0,
  correctChars: 0,
  mistakeCount: 0,
  startedAt: null,
}
