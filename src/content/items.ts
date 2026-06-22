import type { RewardItem } from '../types/index.ts'

export const rewardItems: RewardItem[] = [
  {
    id: 'sword-basic',
    name: 'ひのきのつるぎ',
    category: 'weapon',
    unlockCost: 100,
    description: '木でできた剣。でも立派！',
  },
  {
    id: 'sword-iron',
    name: 'てつのつるぎ',
    category: 'weapon',
    unlockCost: 300,
    description: '鉄製の剣。ゾンビに有効！',
  },
  {
    id: 'sword-pixel',
    name: 'ピクセルブレード',
    category: 'weapon',
    unlockCost: 600,
    description: '8ビットの世界から来た剣。',
  },
  {
    id: 'armor-cloth',
    name: 'ぬののよろい',
    category: 'armor',
    unlockCost: 80,
    description: '軽くて動きやすい。',
  },
  {
    id: 'armor-leather',
    name: 'かわのよろい',
    category: 'armor',
    unlockCost: 250,
    description: 'ゾンビの牙を少し防ぐ。',
  },
  {
    id: 'armor-steel',
    name: 'はがねのよろい',
    category: 'armor',
    unlockCost: 500,
    description: 'ゾンビも怖くない！',
  },
  {
    id: 'friend-slime',
    name: 'スライム',
    category: 'friend',
    unlockCost: 150,
    description: 'なかまになってくれた。',
  },
  {
    id: 'friend-cat',
    name: 'ねこ',
    category: 'friend',
    unlockCost: 400,
    description: 'ゾンビを見張ってくれる。',
  },
  {
    id: 'costume-ghost',
    name: 'おばけコスチューム',
    category: 'costume',
    unlockCost: 200,
    description: 'ゾンビをびっくりさせよう！',
  },
  {
    id: 'bg-forest',
    name: 'もりのせかい',
    category: 'background',
    unlockCost: 350,
    description: '緑のもりでタイピング。',
  },
]
