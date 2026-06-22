/** Visual style of the attack fired toward the zombie on each correct input. */
export interface AttackStyle {
  /** Animation type — determines future rendering component. */
  type: 'beam' | 'bullet' | 'magic' | 'fire'
  /** Primary color of the projectile (CSS color string). */
  color: string
  /** Box-shadow glow color (CSS color string). */
  glowColor: string
  /** Projectile width in pixels. */
  width: number
  /** Short display label shown in the item shop UI. */
  label: string
}

/** Default attack style — the original cyan laser beam (no weapon equipped). */
export const DEFAULT_ATTACK_STYLE: AttackStyle = {
  type: 'beam',
  color: '#00eeff',
  glowColor: 'rgba(0, 238, 255, 0.45)',
  width: 4,
  label: 'レーザービーム',
}
