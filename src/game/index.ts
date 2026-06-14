export { initialGameState } from './gameState.ts'
export type { GameState, GameStatus } from './gameState.ts'
export { calculateScore } from './score.ts'
export type { ScoreInput, ScoreResult } from './score.ts'
export { getRomajiTable, getRomajis, getPreferredRomaji } from './romajiTable.ts'
export type { RomajiTable } from './romajiTable.ts'
export {
  tokenizeInput,
  createTypingState,
  processKey,
  getTokenDisplays,
  getTotalExpectedRomaji,
  getRemainingRomajiCount,
} from './romajiEngine.ts'
export type {
  KanaToken,
  TypingState,
  TokenDisplay,
  KeyResult,
  ProcessKeyResult,
} from './romajiEngine.ts'
export {
  gameLoopReducer,
  initialGameLoopState,
  getElapsedSeconds,
  getDangerTier,
  ZOMBIE_SPEED_PER_SECOND,
  ZOMBIE_RETREAT_PER_CORRECT,
  ZOMBIE_RETREAT_PER_WORD,
} from './gameLoop.ts'
export type { GamePhase, GameLoopState, GameLoopAction, DangerTier } from './gameLoop.ts'
