/** Derive the set of next valid keys from the current TypingState. */
export function getNextKeys(
  tokens: readonly { romajis: readonly string[] }[],
  tokenIndex: number,
  typed: string,
): string[] {
  const token = tokens[tokenIndex]
  if (!token) return []
  return [
    ...new Set(
      token.romajis
        .filter((r) => r.startsWith(typed))
        .map((r) => r[typed.length])
        .filter((c): c is string => c !== undefined),
    ),
  ]
}

const KNOWN_KEYS = new Set([
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',
  'z', 'x', 'c', 'v', 'b', 'n', 'm', ' ',
])

/** Check whether a key appears on the KeyHint QWERTY diagram. */
export function isKnownKey(key: string): boolean {
  return KNOWN_KEYS.has(key)
}
