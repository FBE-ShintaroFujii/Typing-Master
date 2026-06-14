/**
 * Complete hiragana → romaji mapping table.
 * Keys: hiragana string (1 char for basic/dakuten/special, 2 chars for youon compounds).
 * Values: all valid romaji spellings, preferred spelling first.
 */
const RAW_TABLE = [
  // ── Basic vowels ─────────────────────────────────────────
  ['あ', ['a']],
  ['い', ['i']],
  ['う', ['u']],
  ['え', ['e']],
  ['お', ['o']],

  // ── K-row ────────────────────────────────────────────────
  ['か', ['ka']],
  ['き', ['ki']],
  ['く', ['ku']],
  ['け', ['ke']],
  ['こ', ['ko']],

  // ── S-row ────────────────────────────────────────────────
  ['さ', ['sa']],
  ['し', ['shi', 'si']],
  ['す', ['su']],
  ['せ', ['se']],
  ['そ', ['so']],

  // ── T-row ────────────────────────────────────────────────
  ['た', ['ta']],
  ['ち', ['chi', 'ti']],
  ['つ', ['tsu', 'tu']],
  ['て', ['te']],
  ['と', ['to']],

  // ── N-row ────────────────────────────────────────────────
  ['な', ['na']],
  ['に', ['ni']],
  ['ぬ', ['nu']],
  ['ね', ['ne']],
  ['の', ['no']],

  // ── H-row ────────────────────────────────────────────────
  ['は', ['ha']],
  ['ひ', ['hi']],
  ['ふ', ['fu', 'hu']],
  ['へ', ['he']],
  ['ほ', ['ho']],

  // ── M-row ────────────────────────────────────────────────
  ['ま', ['ma']],
  ['み', ['mi']],
  ['む', ['mu']],
  ['め', ['me']],
  ['も', ['mo']],

  // ── Y-row ────────────────────────────────────────────────
  ['や', ['ya']],
  ['ゆ', ['yu']],
  ['よ', ['yo']],

  // ── R-row ────────────────────────────────────────────────
  ['ら', ['ra']],
  ['り', ['ri']],
  ['る', ['ru']],
  ['れ', ['re']],
  ['ろ', ['ro']],

  // ── W-row ────────────────────────────────────────────────
  ['わ', ['wa']],
  ['ゐ', ['wi']],
  ['ゑ', ['we']],
  ['を', ['wo']],

  // ── ん (context-aware handling in engine) ────────────────
  ['ん', ['nn']],

  // ── G-row (dakuten) ──────────────────────────────────────
  ['が', ['ga']],
  ['ぎ', ['gi']],
  ['ぐ', ['gu']],
  ['げ', ['ge']],
  ['ご', ['go']],

  // ── Z-row (dakuten) ──────────────────────────────────────
  ['ざ', ['za']],
  ['じ', ['ji', 'zi']],
  ['ず', ['zu']],
  ['ぜ', ['ze']],
  ['ぞ', ['zo']],

  // ── D-row (dakuten) ──────────────────────────────────────
  ['だ', ['da']],
  ['ぢ', ['di']],
  ['づ', ['du']],
  ['で', ['de']],
  ['ど', ['do']],

  // ── B-row (dakuten) ──────────────────────────────────────
  ['ば', ['ba']],
  ['び', ['bi']],
  ['ぶ', ['bu']],
  ['べ', ['be']],
  ['ぼ', ['bo']],

  // ── P-row (handakuten) ───────────────────────────────────
  ['ぱ', ['pa']],
  ['ぴ', ['pi']],
  ['ぷ', ['pu']],
  ['ぺ', ['pe']],
  ['ぽ', ['po']],

  // ── Small standalone kana ────────────────────────────────
  ['ぁ', ['xa', 'la']],
  ['ぃ', ['xi', 'li']],
  ['ぅ', ['xu', 'lu']],
  ['ぇ', ['xe', 'le']],
  ['ぉ', ['xo', 'lo']],
  ['ゃ', ['xya', 'lya']],
  ['ゅ', ['xyu', 'lyu']],
  ['ょ', ['xyo', 'lyo']],

  // ── Sokuon standalone (double-consonant handled in engine) ─
  ['っ', ['xtsu', 'ltsu', 'xtu', 'ltu']],

  // ── Youon K-compounds ────────────────────────────────────
  ['きゃ', ['kya']],
  ['きゅ', ['kyu']],
  ['きょ', ['kyo']],

  // ── Youon S-compounds (し) ───────────────────────────────
  ['しゃ', ['sha', 'sya']],
  ['しゅ', ['shu', 'syu']],
  ['しょ', ['sho', 'syo']],

  // ── Youon T-compounds (ち) ───────────────────────────────
  ['ちゃ', ['cha', 'tya', 'cya']],
  ['ちゅ', ['chu', 'tyu', 'cyu']],
  ['ちょ', ['cho', 'tyo', 'cyo']],

  // ── Youon N-compounds ────────────────────────────────────
  ['にゃ', ['nya']],
  ['にゅ', ['nyu']],
  ['にょ', ['nyo']],

  // ── Youon H-compounds ────────────────────────────────────
  ['ひゃ', ['hya']],
  ['ひゅ', ['hyu']],
  ['ひょ', ['hyo']],

  // ── Youon M-compounds ────────────────────────────────────
  ['みゃ', ['mya']],
  ['みゅ', ['myu']],
  ['みょ', ['myo']],

  // ── Youon R-compounds ────────────────────────────────────
  ['りゃ', ['rya']],
  ['りゅ', ['ryu']],
  ['りょ', ['ryo']],

  // ── Youon GY-compounds ───────────────────────────────────
  ['ぎゃ', ['gya']],
  ['ぎゅ', ['gyu']],
  ['ぎょ', ['gyo']],

  // ── Youon JY-compounds (じ) ──────────────────────────────
  ['じゃ', ['ja', 'jya', 'zya']],
  ['じゅ', ['ju', 'jyu', 'zyu']],
  ['じょ', ['jo', 'jyo', 'zyo']],

  // ── Youon DY-compounds (ぢ) ──────────────────────────────
  ['ぢゃ', ['dya']],
  ['ぢゅ', ['dyu']],
  ['ぢょ', ['dyo']],

  // ── Youon BY-compounds ───────────────────────────────────
  ['びゃ', ['bya']],
  ['びゅ', ['byu']],
  ['びょ', ['byo']],

  // ── Youon PY-compounds ───────────────────────────────────
  ['ぴゃ', ['pya']],
  ['ぴゅ', ['pyu']],
  ['ぴょ', ['pyo']],
] as const satisfies readonly (readonly [string, readonly string[]])[]

export type RomajiTable = ReadonlyMap<string, readonly string[]>

let _cached: RomajiTable | null = null

/** Returns the shared singleton romaji table. */
export function getRomajiTable(): RomajiTable {
  if (!_cached) {
    _cached = new Map(RAW_TABLE as Iterable<readonly [string, readonly string[]]>)
  }
  return _cached
}

/** Returns all valid romaji spellings for a kana chunk (1- or 2-char). */
export function getRomajis(kana: string): readonly string[] {
  return getRomajiTable().get(kana) ?? [kana]
}

/** Returns the preferred (first) romaji spelling for a kana chunk. */
export function getPreferredRomaji(kana: string): string {
  return getRomajis(kana)[0] ?? kana
}
