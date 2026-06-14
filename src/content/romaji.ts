export interface RomajiEntry {
  kana: string
  patterns: string[]
  group: string
}

export const romajiCheatSheet: RomajiEntry[] = [
  // ── あ行 ──────────────────────────────────────────
  { kana: 'あ', patterns: ['a'],       group: 'あ行' },
  { kana: 'い', patterns: ['i'],       group: 'あ行' },
  { kana: 'う', patterns: ['u'],       group: 'あ行' },
  { kana: 'え', patterns: ['e'],       group: 'あ行' },
  { kana: 'お', patterns: ['o'],       group: 'あ行' },
  // ── か行 ──────────────────────────────────────────
  { kana: 'か', patterns: ['ka'],      group: 'か行' },
  { kana: 'き', patterns: ['ki'],      group: 'か行' },
  { kana: 'く', patterns: ['ku'],      group: 'か行' },
  { kana: 'け', patterns: ['ke'],      group: 'か行' },
  { kana: 'こ', patterns: ['ko'],      group: 'か行' },
  // ── さ行 ──────────────────────────────────────────
  { kana: 'さ', patterns: ['sa'],          group: 'さ行' },
  { kana: 'し', patterns: ['shi', 'si'],   group: 'さ行' },
  { kana: 'す', patterns: ['su'],          group: 'さ行' },
  { kana: 'せ', patterns: ['se'],          group: 'さ行' },
  { kana: 'そ', patterns: ['so'],          group: 'さ行' },
  // ── た行 ──────────────────────────────────────────
  { kana: 'た', patterns: ['ta'],          group: 'た行' },
  { kana: 'ち', patterns: ['chi', 'ti'],   group: 'た行' },
  { kana: 'つ', patterns: ['tsu', 'tu'],   group: 'た行' },
  { kana: 'て', patterns: ['te'],          group: 'た行' },
  { kana: 'と', patterns: ['to'],          group: 'た行' },
  // ── な行 ──────────────────────────────────────────
  { kana: 'な', patterns: ['na'],      group: 'な行' },
  { kana: 'に', patterns: ['ni'],      group: 'な行' },
  { kana: 'ぬ', patterns: ['nu'],      group: 'な行' },
  { kana: 'ね', patterns: ['ne'],      group: 'な行' },
  { kana: 'の', patterns: ['no'],      group: 'な行' },
  // ── は行 ──────────────────────────────────────────
  { kana: 'は', patterns: ['ha'],          group: 'は行' },
  { kana: 'ひ', patterns: ['hi'],          group: 'は行' },
  { kana: 'ふ', patterns: ['fu', 'hu'],    group: 'は行' },
  { kana: 'へ', patterns: ['he'],          group: 'は行' },
  { kana: 'ほ', patterns: ['ho'],          group: 'は行' },
  // ── ま行 ──────────────────────────────────────────
  { kana: 'ま', patterns: ['ma'],      group: 'ま行' },
  { kana: 'み', patterns: ['mi'],      group: 'ま行' },
  { kana: 'む', patterns: ['mu'],      group: 'ま行' },
  { kana: 'め', patterns: ['me'],      group: 'ま行' },
  { kana: 'も', patterns: ['mo'],      group: 'ま行' },
  // ── や行 ──────────────────────────────────────────
  { kana: 'や', patterns: ['ya'],      group: 'や行' },
  { kana: 'ゆ', patterns: ['yu'],      group: 'や行' },
  { kana: 'よ', patterns: ['yo'],      group: 'や行' },
  // ── ら行 ──────────────────────────────────────────
  { kana: 'ら', patterns: ['ra'],      group: 'ら行' },
  { kana: 'り', patterns: ['ri'],      group: 'ら行' },
  { kana: 'る', patterns: ['ru'],      group: 'ら行' },
  { kana: 'れ', patterns: ['re'],      group: 'ら行' },
  { kana: 'ろ', patterns: ['ro'],      group: 'ら行' },
  // ── わ行・ん ──────────────────────────────────────
  { kana: 'わ', patterns: ['wa'],          group: 'わ行' },
  { kana: 'を', patterns: ['wo', 'o'],     group: 'わ行' },
  { kana: 'ん', patterns: ['n', 'nn'],     group: 'わ行' },
  // ── 濁音 (が行) ───────────────────────────────────
  { kana: 'が', patterns: ['ga'],      group: '濁音' },
  { kana: 'ぎ', patterns: ['gi'],      group: '濁音' },
  { kana: 'ぐ', patterns: ['gu'],      group: '濁音' },
  { kana: 'げ', patterns: ['ge'],      group: '濁音' },
  { kana: 'ご', patterns: ['go'],      group: '濁音' },
  // ── 濁音 (ざ行) ───────────────────────────────────
  { kana: 'ざ', patterns: ['za'],          group: '濁音' },
  { kana: 'じ', patterns: ['ji', 'zi'],    group: '濁音' },
  { kana: 'ず', patterns: ['zu'],          group: '濁音' },
  { kana: 'ぜ', patterns: ['ze'],          group: '濁音' },
  { kana: 'ぞ', patterns: ['zo'],          group: '濁音' },
  // ── 濁音 (だ行) ───────────────────────────────────
  { kana: 'だ', patterns: ['da'],          group: '濁音' },
  { kana: 'ぢ', patterns: ['di', 'ji'],    group: '濁音' },
  { kana: 'づ', patterns: ['du', 'zu'],    group: '濁音' },
  { kana: 'で', patterns: ['de'],          group: '濁音' },
  { kana: 'ど', patterns: ['do'],          group: '濁音' },
  // ── 濁音 (ば行) ───────────────────────────────────
  { kana: 'ば', patterns: ['ba'],      group: '濁音' },
  { kana: 'び', patterns: ['bi'],      group: '濁音' },
  { kana: 'ぶ', patterns: ['bu'],      group: '濁音' },
  { kana: 'べ', patterns: ['be'],      group: '濁音' },
  { kana: 'ぼ', patterns: ['bo'],      group: '濁音' },
  // ── 半濁音 (ぱ行) ────────────────────────────────
  { kana: 'ぱ', patterns: ['pa'],      group: '半濁音' },
  { kana: 'ぴ', patterns: ['pi'],      group: '半濁音' },
  { kana: 'ぷ', patterns: ['pu'],      group: '半濁音' },
  { kana: 'ぺ', patterns: ['pe'],      group: '半濁音' },
  { kana: 'ぽ', patterns: ['po'],      group: '半濁音' },
  // ── 拗音（清音）────────────────────────────────────
  { kana: 'きゃ', patterns: ['kya'],           group: '拗音' },
  { kana: 'きゅ', patterns: ['kyu'],           group: '拗音' },
  { kana: 'きょ', patterns: ['kyo'],           group: '拗音' },
  { kana: 'しゃ', patterns: ['sha', 'sya'],    group: '拗音' },
  { kana: 'しゅ', patterns: ['shu', 'syu'],    group: '拗音' },
  { kana: 'しょ', patterns: ['sho', 'syo'],    group: '拗音' },
  { kana: 'ちゃ', patterns: ['cha', 'tya'],    group: '拗音' },
  { kana: 'ちゅ', patterns: ['chu', 'tyu'],    group: '拗音' },
  { kana: 'ちょ', patterns: ['cho', 'tyo'],    group: '拗音' },
  { kana: 'にゃ', patterns: ['nya'],           group: '拗音' },
  { kana: 'にゅ', patterns: ['nyu'],           group: '拗音' },
  { kana: 'にょ', patterns: ['nyo'],           group: '拗音' },
  { kana: 'ひゃ', patterns: ['hya'],           group: '拗音' },
  { kana: 'ひゅ', patterns: ['hyu'],           group: '拗音' },
  { kana: 'ひょ', patterns: ['hyo'],           group: '拗音' },
  { kana: 'みゃ', patterns: ['mya'],           group: '拗音' },
  { kana: 'みゅ', patterns: ['myu'],           group: '拗音' },
  { kana: 'みょ', patterns: ['myo'],           group: '拗音' },
  { kana: 'りゃ', patterns: ['rya'],           group: '拗音' },
  { kana: 'りゅ', patterns: ['ryu'],           group: '拗音' },
  { kana: 'りょ', patterns: ['ryo'],           group: '拗音' },
  // ── 拗音（濁音）────────────────────────────────────
  { kana: 'ぎゃ', patterns: ['gya'],           group: '拗音（濁）' },
  { kana: 'ぎゅ', patterns: ['gyu'],           group: '拗音（濁）' },
  { kana: 'ぎょ', patterns: ['gyo'],           group: '拗音（濁）' },
  { kana: 'じゃ', patterns: ['ja', 'jya', 'zya'],  group: '拗音（濁）' },
  { kana: 'じゅ', patterns: ['ju', 'jyu', 'zyu'],  group: '拗音（濁）' },
  { kana: 'じょ', patterns: ['jo', 'jyo', 'zyo'],  group: '拗音（濁）' },
  { kana: 'びゃ', patterns: ['bya'],           group: '拗音（濁）' },
  { kana: 'びゅ', patterns: ['byu'],           group: '拗音（濁）' },
  { kana: 'びょ', patterns: ['byo'],           group: '拗音（濁）' },
  // ── 拗音（半濁音）──────────────────────────────────
  { kana: 'ぴゃ', patterns: ['pya'],           group: '拗音（半濁）' },
  { kana: 'ぴゅ', patterns: ['pyu'],           group: '拗音（半濁）' },
  { kana: 'ぴょ', patterns: ['pyo'],           group: '拗音（半濁）' },
  // ── 特殊 ─────────────────────────────────────────
  { kana: 'っ', patterns: ['xtsu', 'ltsu'],   group: '特殊' },
  { kana: 'ー', patterns: ['-'],              group: '特殊' },
]
