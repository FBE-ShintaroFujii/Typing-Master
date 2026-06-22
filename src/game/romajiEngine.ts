import type { InputMode } from '../types/index.ts'
import { getRomajiTable } from './romajiTable.ts'

// ── Types ────────────────────────────────────────────────────────────────────

/** A single "unit" of typing: one kana (or punctuation/space) and its valid romaji spellings. */
export interface KanaToken {
  /** The source kana character(s) (1 char for most, 2 for youon compounds). */
  source: string
  /** All valid romaji completions, preferred spelling first. */
  romajis: readonly string[]
}

/**
 * Immutable snapshot of typing progress within a single word/prompt.
 * Advance it by calling `processKey`.
 */
export interface TypingState {
  tokens: readonly KanaToken[]
  /** Index of the token currently being typed. */
  tokenIndex: number
  /** Characters typed so far for the current token (resets when token completes). */
  typed: string
}

/** Per-token display information for rendering the prompt. */
export interface TokenDisplay {
  source: string
  /** The romaji string to display (best match given `typedPart`). */
  romaji: string
  /** The portion already typed for this token. */
  typedPart: string
  isDone: boolean
  isCurrent: boolean
}

export type KeyResult = 'correct' | 'token-complete' | 'word-complete' | 'mistake'

export interface ProcessKeyResult {
  result: KeyResult
  state: TypingState
}

// ── Internal helpers ─────────────────────────────────────────────────────────

const SMALL_Y_KANA = new Set(['ゃ', 'ゅ', 'ょ'])

function isHiragana(c: string): boolean {
  const cp = c.codePointAt(0) ?? 0
  return cp >= 0x3041 && cp <= 0x3096
}

/** Whether c is a small y-kana (ゃゅょ) that forms a youon compound with preceding kana. */
function isSmallYKana(c: string): boolean {
  return SMALL_Y_KANA.has(c)
}

/**
 * Returns the romajis of the next meaningful (non-sokuon) kana starting at `i`,
 * including youon compound detection.  Returns an empty array if none found.
 */
function peekNextRomajis(input: string, i: number): readonly string[] {
  const table = getRomajiTable()
  while (i < input.length) {
    const ch = input[i]
    if (!isHiragana(ch)) return []
    if (ch === 'っ') { i++; continue } // skip additional sokuon
    const next = input[i + 1]
    if (next && isSmallYKana(next)) {
      return table.get(ch + next) ?? table.get(ch) ?? []
    }
    return table.get(ch) ?? []
  }
  return []
}

// ── Punctuation / direct-char map ────────────────────────────────────────────

const PUNCT_MAP: Readonly<Record<string, string>> = {
  '　': ' ',
  '。': '.',
  '、': ',',
  'ー': '-',
  '・': '/',
  '！': '!',
  '？': '?',
  '「': '[',
  '」': ']',
  '（': '(',
  '）': ')',
}

// ── Tokenizer ────────────────────────────────────────────────────────────────

/**
 * Converts an input string into an ordered list of `KanaToken`s.
 *
 * - `'direct'` / `'free'`: each character maps to itself (no conversion).
 * - `'romaji'`: hiragana → romaji via table; punctuation via PUNCT_MAP.
 *
 * Special handling:
 * - Youon compounds (きゃ, しょ, …) → merged into single 2-char token.
 * - Sokuon (っ): valid romajis = ['xtsu', 'ltsu'] + {first consonant of next kana}.
 * - ん: allows single 'n' only when next kana's romaji does NOT start with n/a/i/u/e/o/y.
 */
export function tokenizeInput(input: string, mode: InputMode): KanaToken[] {
  if (mode !== 'romaji') {
    // direct / free: literal characters
    return [...input].map((c) => ({ source: c, romajis: [c] as readonly string[] }))
  }

  // Normalize full-width katakana (U+30A1-U+30F6) to hiragana (U+3041-U+3096)
  // so that e.g. ゾンビ is treated identically to ぞんび.
  const text = input.replace(/[\u30A1-\u30F6]/gu, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  )

  const table = getRomajiTable()
  const tokens: KanaToken[] = []
  let i = 0

  while (i < text.length) {
    const ch = text[i]

    // Non-hiragana: punctuation, spaces, ASCII
    if (!isHiragana(ch)) {
      const mapped = PUNCT_MAP[ch] ?? ch
      tokens.push({ source: ch, romajis: [mapped] })
      i++
      continue
    }

    // Sokuon (っ)
    if (ch === 'っ') {
      const nextRomajis = peekNextRomajis(text, i + 1)
      const consonants = new Set<string>()
      for (const r of nextRomajis) {
        const first = r[0]
        if (first && /[bcdfghjklmnpqrstvwxyz]/.test(first)) {
          consonants.add(first)
        }
      }
      // Preferred order: doubled-consonant method first (school standard),
      // then explicit xtsu/ltsu as fallback (e.g., for っ at end of word).
      tokens.push({
        source: 'っ',
        romajis: [...consonants, 'xtsu', 'ltsu', 'xtu', 'ltu'],
      })
      i++
      continue
    }

    // ん — context-aware single-n allowance
    if (ch === 'ん') {
      const nextRomajis = peekNextRomajis(text, i + 1)
      const nextFirst = nextRomajis[0]?.[0] ?? ''
      // Single 'n' is ambiguous only when followed by na-row, vowel, 'n', or 'y'.
      // At end-of-word (nextFirst === '') single 'n' is unambiguous and allowed.
      const singleNAmbiguous = /^[naiueoy]/.test(nextFirst)
      tokens.push({
        source: 'ん',
        romajis: singleNAmbiguous ? ['nn'] : ['nn', 'n'],
      })
      i++
      continue
    }

    // Youon compound: current kana + small y-kana
    const next = text[i + 1]
    if (next && isSmallYKana(next)) {
      const compound = ch + next
      const compoundRomajis = table.get(compound)
      if (compoundRomajis) {
        tokens.push({ source: compound, romajis: compoundRomajis })
        i += 2
        continue
      }
    }

    // Regular single kana
    const romajis = table.get(ch)
    tokens.push({ source: ch, romajis: romajis ?? [ch] })
    i++
  }

  return tokens
}

// ── State factory ─────────────────────────────────────────────────────────────

/** Creates a fresh `TypingState` for a given input string and mode. */
export function createTypingState(input: string, mode: InputMode): TypingState {
  return {
    tokens: tokenizeInput(input, mode),
    tokenIndex: 0,
    typed: '',
  }
}

// ── Core engine ──────────────────────────────────────────────────────────────

/**
 * Advance the typing state by one key press.
 *
 * Completion rule: a token is only marked complete when ALL currently-matching
 * romajis are exact matches (no longer alternatives remain). This prevents 'n'
 * from prematurely completing ん when 'nn' is also a valid romaji.
 *
 * Backtracking: if the key doesn't match any continuation for the current token
 * but `typed` itself is a valid exact romaji, the engine silently completes the
 * current token and retries the key against the next token. This allows both
 * 'sanpo' and 'sannpo' to work correctly for さんぽ.
 */
export function processKey(state: TypingState, key: string): ProcessKeyResult {
  const { tokens, tokenIndex, typed } = state

  if (tokenIndex >= tokens.length) {
    return { result: 'word-complete', state }
  }

  const token = tokens[tokenIndex]
  const attempt = typed + key

  const matching = token.romajis.filter((r) => r.startsWith(attempt))
  const exact = matching.filter((r) => r === attempt)

  // Direct match found
  if (matching.length > 0) {
    const nextIndex = tokenIndex + 1
    const isLastToken = nextIndex >= tokens.length
    // Complete when:
    // - all matching romajis are exact (no longer alternatives), OR
    // - it's the last token (no next character can resolve the ambiguity)
    if (exact.length > 0 && (matching.length === exact.length || isLastToken)) {
      const nextState: TypingState = { tokens, tokenIndex: nextIndex, typed: '' }
      return {
        result: isLastToken ? 'word-complete' : 'token-complete',
        state: nextState,
      }
    }
    // Partial match (longer options remain and more tokens follow)
    return { result: 'correct', state: { tokens, tokenIndex, typed: attempt } }
  }

  // No direct match — try backtracking:
  // if the characters typed so far are an exact romaji for the current token,
  // silently complete it and retry the key against the next token.
  if (typed.length > 0 && tokenIndex + 1 < tokens.length) {
    const prevIsExact = token.romajis.some((r) => r === typed)
    if (prevIsExact) {
      const nextIndex = tokenIndex + 1
      const nextToken = tokens[nextIndex]
      const nextMatching = nextToken.romajis.filter((r) => r.startsWith(key))
      const nextExact = nextMatching.filter((r) => r === key)

      if (nextMatching.length > 0) {
        if (nextExact.length > 0 && nextMatching.length === nextExact.length) {
          const afterNextIndex = nextIndex + 1
          const nextState: TypingState = { tokens, tokenIndex: afterNextIndex, typed: '' }
          return {
            result: afterNextIndex >= tokens.length ? 'word-complete' : 'token-complete',
            state: nextState,
          }
        }
        // Partial match on next token
        return { result: 'correct', state: { tokens, tokenIndex: nextIndex, typed: key } }
      }
    }
  }

  return { result: 'mistake', state }
}

// ── Display helpers ───────────────────────────────────────────────────────────

/**
 * Returns per-token display info for rendering the typing prompt.
 *
 * For the current token, `romaji` is the best matching option given the
 * characters typed so far, so the UI can split it into "typed" + "remaining".
 */
export function getTokenDisplays(state: TypingState): TokenDisplay[] {
  return state.tokens.map((token, i) => {
    const preferred = token.romajis[0] ?? token.source

    if (i < state.tokenIndex) {
      return { source: token.source, romaji: preferred, typedPart: preferred, isDone: true, isCurrent: false }
    }

    if (i === state.tokenIndex) {
      const bestMatch = token.romajis.find((r) => r.startsWith(state.typed)) ?? preferred
      return { source: token.source, romaji: bestMatch, typedPart: state.typed, isDone: false, isCurrent: true }
    }

    return { source: token.source, romaji: preferred, typedPart: '', isDone: false, isCurrent: false }
  })
}

/**
 * Returns a flat string of the full expected romaji for a prompt
 * (joining all token preferred romajis), used for "chars remaining" calculations.
 */
export function getTotalExpectedRomaji(state: TypingState): string {
  return state.tokens.map((t) => t.romajis[0] ?? t.source).join('')
}

/** Count of romaji characters still remaining (includes in-progress current token). */
export function getRemainingRomajiCount(state: TypingState): number {
  const currentTokenLength = state.tokens[state.tokenIndex]?.romajis[0]?.length ?? 0
  const currentRemaining = Math.max(0, currentTokenLength - state.typed.length)
  const futureChars = state.tokens
    .slice(state.tokenIndex + 1)
    .reduce((sum, t) => sum + (t.romajis[0]?.length ?? 1), 0)
  return currentRemaining + futureChars
}
