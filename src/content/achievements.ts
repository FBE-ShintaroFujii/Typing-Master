import type { AchievementDefinition } from '../types/index.ts'

export const achievements: AchievementDefinition[] = [
  { id: 'first-step', name: 'はじめの一歩', description: '初めてステージクリア', conditionType: 'firstStageClear', target: 1 },
  { id: 'determination', name: 'DETERMINATION', description: 'ゲームオーバーから3回リトライ', conditionType: 'retryCount', target: 3 },
  { id: 'speed-40', name: '1分40文字', description: '文科省目標達成', conditionType: 'speedTarget', target: 40 },
  { id: 'streak-7', name: '7日連続', description: '7日間連続練習', conditionType: 'streakDays', target: 7 },
  { id: 'diary-master', name: '日記の主', description: 'Lv.7で10回自由入力', conditionType: 'freeInputCount', target: 10 },
  { id: 'hiragana-master', name: 'ひらがなマスター', description: 'フェーズ1全ステージクリア', conditionType: 'phaseOneClear', target: 7 },
  { id: 'kanji-door', name: '漢字への扉', description: 'フェーズ2解放', conditionType: 'phaseTwoUnlocked', target: 1 },
]
