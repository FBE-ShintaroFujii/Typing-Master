export type InputMode = 'direct' | 'romaji' | 'free'
export type ZombieSpeed = 'none' | 'slow' | 'normal' | 'fast'
/**
 * Controls how much typing assistance is shown during a romaji stage.
 * - 'full'      : hiragana + romaji row + keyboard hint (Lv3–6 default)
 * - 'kana-only' : hiragana only; keyboard hint still appears on mistakes / inactivity
 * - 'none'      : hiragana only; keyboard hint also disabled
 */
export type HintMode = 'full' | 'kana-only' | 'none'

export interface StagePrompt {
  id: string
  label: string
  expected: string
  reading?: string
}

export interface StageDefinition {
  id: string
  level: number
  title: string
  description: string
  inputMode: InputMode
  /** Omit or set to 'full' to get the original behaviour (Lv3–6). */
  hintMode?: HintMode
  targetCharsPerMinute: number | null
  zombieSpeed: ZombieSpeed
  estimatedSeconds: number
  prompts: StagePrompt[]
}
