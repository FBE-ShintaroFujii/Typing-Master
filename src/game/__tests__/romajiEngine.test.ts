import { createTypingState, getTokenDisplays, processKey, tokenizeInput } from '../romajiEngine.ts'

// ── Helper ────────────────────────────────────────────────────────────────────

/** Type an entire string through the engine, returning the final result. */
function typeString(input: string, mode: 'romaji' | 'direct', romaji: string) {
  let state = createTypingState(input, mode)
  const results: string[] = []
  for (const ch of romaji) {
    const { result, state: next } = processKey(state, ch)
    results.push(result)
    state = next
  }
  return { results, state }
}

/** Convenience: type a full romaji and expect no mistakes. */
function expectClean(input: string, mode: 'romaji' | 'direct', romaji: string) {
  const { results } = typeString(input, mode, romaji)
  const lastResult = results[results.length - 1]
  const hasMistake = results.includes('mistake')
  expect(hasMistake).toBe(false)
  expect(lastResult).toBe('word-complete')
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────

describe('tokenizeInput – direct mode', () => {
  it('maps each ASCII character to itself', () => {
    const tokens = tokenizeInput('asdf', 'direct')
    expect(tokens).toHaveLength(4)
    expect(tokens[0]).toEqual({ source: 'a', romajis: ['a'] })
    expect(tokens[3]).toEqual({ source: 'f', romajis: ['f'] })
  })
})

describe('tokenizeInput – romaji mode', () => {
  it('basic vowels', () => {
    const tokens = tokenizeInput('あいうえお', 'romaji')
    const romajis = tokens.map((t) => t.romajis[0])
    expect(romajis).toEqual(['a', 'i', 'u', 'e', 'o'])
  })

  it('youon compound きょ', () => {
    const tokens = tokenizeInput('きょ', 'romaji')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].source).toBe('きょ')
    expect(tokens[0].romajis[0]).toBe('kyo')
  })

  it('youon compound しゃ has multiple options', () => {
    const tokens = tokenizeInput('しゃ', 'romaji')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].romajis).toContain('sha')
    expect(tokens[0].romajis).toContain('sya')
  })

  it('sokuon っか double-consonant option k', () => {
    const tokens = tokenizeInput('っか', 'romaji')
    expect(tokens).toHaveLength(2)
    expect(tokens[0].source).toBe('っ')
    expect(tokens[0].romajis).toContain('k')
    expect(tokens[0].romajis).toContain('xtsu')
    expect(tokens[0].romajis).toContain('ltsu')
  })

  it('っか: preferred hint is k (doubled-consonant), not xtsu', () => {
    const tokens = tokenizeInput('っか', 'romaji')
    expect(tokens[0].romajis[0]).toBe('k')
  })

  it('って: preferred hint is t (doubled-consonant)', () => {
    const tokens = tokenizeInput('って', 'romaji')
    expect(tokens[0].romajis[0]).toBe('t')
  })

  it('sokuon っし double-consonant option s', () => {
    const tokens = tokenizeInput('っし', 'romaji')
    expect(tokens[0].romajis).toContain('s')
  })

  it('ん before consonant allows single n', () => {
    // さんぽ — next is ぽ (pa), starts with 'p'
    const tokens = tokenizeInput('さんぽ', 'romaji')
    const nToken = tokens[1]
    expect(nToken?.source).toBe('ん')
    expect(nToken?.romajis).toContain('n')
    expect(nToken?.romajis).toContain('nn')
  })

  it('ん before な-row requires double nn', () => {
    // まんな — next is な (na), starts with 'n'
    const tokens = tokenizeInput('まんな', 'romaji')
    const nToken = tokens[1]
    expect(nToken?.source).toBe('ん')
    expect(nToken?.romajis).not.toContain('n')
    expect(nToken?.romajis).toContain('nn')
  })

  it('ん before vowel kana requires double nn', () => {
    // たんい — next is い (i)
    const tokens = tokenizeInput('たんい', 'romaji')
    const nToken = tokens[1]
    expect(nToken?.romajis).not.toContain('n')
    expect(nToken?.romajis).toContain('nn')
  })

  it('ん at end-of-word allows single n (unambiguous)', () => {
    const tokens = tokenizeInput('でん', 'romaji')
    const nToken = tokens[1]
    expect(nToken?.romajis).toContain('n')
    expect(nToken?.romajis).toContain('nn')
  })

  it('punctuation 。→ .', () => {
    const tokens = tokenizeInput('。', 'romaji')
    expect(tokens[0].romajis[0]).toBe('.')
  })

  it('long vowel ー→ -', () => {
    const tokens = tokenizeInput('ー', 'romaji')
    expect(tokens[0].romajis[0]).toBe('-')
  })
})

// ── processKey ────────────────────────────────────────────────────────────────

describe('processKey – direct mode', () => {
  it('accepts correct characters one by one', () => {
    let state = createTypingState('abc', 'direct')
    let r = processKey(state, 'a')
    expect(r.result).toBe('token-complete')
    state = r.state
    r = processKey(state, 'b')
    expect(r.result).toBe('token-complete')
    state = r.state
    r = processKey(state, 'c')
    expect(r.result).toBe('word-complete')
  })

  it('rejects wrong key and preserves state', () => {
    const state = createTypingState('x', 'direct')
    const { result, state: next } = processKey(state, 'y')
    expect(result).toBe('mistake')
    expect(next).toBe(state) // state reference unchanged on mistake
  })
})

describe('processKey – romaji mode', () => {
  it('basic: あ typed as a', () => {
    const state = createTypingState('あ', 'romaji')
    const { result } = processKey(state, 'a')
    expect(result).toBe('word-complete')
  })

  it('multi-char token: か typed as k then a', () => {
    let state = createTypingState('か', 'romaji')
    let r = processKey(state, 'k')
    expect(r.result).toBe('correct')
    state = r.state
    r = processKey(state, 'a')
    expect(r.result).toBe('word-complete')
  })

  it('wrong key mid-token is a mistake', () => {
    let state = createTypingState('か', 'romaji')
    state = processKey(state, 'k').state
    const { result } = processKey(state, 'x')
    expect(result).toBe('mistake')
  })

  it('し can be typed as shi', () => {
    expectClean('し', 'romaji', 'shi')
  })

  it('し can be typed as si (alternate)', () => {
    expectClean('し', 'romaji', 'si')
  })

  it('きょ typed as kyo', () => {
    expectClean('きょ', 'romaji', 'kyo')
  })

  it('じゃ typed as ja', () => {
    expectClean('じゃ', 'romaji', 'ja')
  })

  it('じゃ typed as jya (alternate)', () => {
    expectClean('じゃ', 'romaji', 'jya')
  })

  it('じゃ typed as zya (alternate)', () => {
    expectClean('じゃ', 'romaji', 'zya')
  })

  it('しゃしん typed as shashin', () => {
    expectClean('しゃしん', 'romaji', 'shashin')
  })

  it('きって – sokuon via double consonant (kitte)', () => {
    expectClean('きって', 'romaji', 'kitte')
  })

  it('きって – sokuon via xtsu (kixtsute)', () => {
    expectClean('きって', 'romaji', 'kixtsute')
  })

  it('がっこう – sokuon gakkou', () => {
    expectClean('がっこう', 'romaji', 'gakkou')
  })

  it('ともだち typed as tomodachi', () => {
    expectClean('ともだち', 'romaji', 'tomodachi')
  })

  it('じゅぎょう typed as jugyou', () => {
    expectClean('じゅぎょう', 'romaji', 'jugyou')
  })

  it('さんぽ typed as sanpo (single n)', () => {
    expectClean('さんぽ', 'romaji', 'sanpo')
  })

  it('さんぽ typed as sannpo (double n)', () => {
    expectClean('さんぽ', 'romaji', 'sannpo')
  })

  it('でんき – ん before k allows single n (denki)', () => {
    expectClean('でんき', 'romaji', 'denki')
  })

  it('multi-prompt word with space: きょうは いい', () => {
    // space character in romaji-mode input maps directly to space key
    expectClean('きょうは ', 'romaji', 'kyouha ')
  })

  it('punctuation: 。 typed as period', () => {
    expectClean('。', 'romaji', '.')
  })
})

// ── getTokenDisplays ──────────────────────────────────────────────────────────

describe('getTokenDisplays', () => {
  it('marks completed tokens isDone=true', () => {
    let state = createTypingState('かき', 'romaji')
    // Complete か
    state = processKey(state, 'k').state
    state = processKey(state, 'a').state
    const displays = getTokenDisplays(state)
    expect(displays[0].isDone).toBe(true)
    expect(displays[1].isCurrent).toBe(true)
  })

  it('shows typedPart for current token', () => {
    let state = createTypingState('か', 'romaji')
    state = processKey(state, 'k').state
    const displays = getTokenDisplays(state)
    expect(displays[0].typedPart).toBe('k')
    expect(displays[0].romaji).toBe('ka')
  })

  it('shows best-match romaji when alternate used (si for し)', () => {
    let state = createTypingState('し', 'romaji')
    state = processKey(state, 's').state
    state = processKey(state, 'i').state
    // After completion, isDone=true for し
    const displays = getTokenDisplays(state)
    // tokenIndex = 1 (past the end), first token is done
    expect(displays[0].isDone).toBe(true)
  })
})
