export type InputMode = 'direct' | 'romaji' | 'free'
export type ZombieSpeed = 'none' | 'slow' | 'normal' | 'fast'

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
  targetCharsPerMinute: number | null
  zombieSpeed: ZombieSpeed
  estimatedSeconds: number
  prompts: StagePrompt[]
}
