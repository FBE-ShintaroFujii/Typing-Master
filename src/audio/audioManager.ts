export interface AudioCue {
  frequency: number
  durationMs: number
  type?: OscillatorType
}

/** Frequencies (Hz) for the looping BGM arpeggio (C-major pentatonic) */
const BGM_NOTES: readonly number[] = [262, 330, 392, 523, 392, 330]
const BGM_BASE_INTERVAL_MS = 280

export class ChiptuneAudioManager {
  private context: AudioContext | null = null
  private bgmRunning = false
  private bgmNoteIndex = 0
  private bgmTimeout: ReturnType<typeof setTimeout> | null = null
  private zombieProximity = 0 // 0 = none, 1 = very close

  // ── internal helpers ─────────────────────────────────────────────────

  private getContext(): AudioContext {
    this.context ??= new AudioContext()
    return this.context
  }

  private scheduleNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    durationSec: number,
    volume: number,
    type: OscillatorType = 'square',
  ): void {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, startTime)
    gain.gain.linearRampToValueAtTime(0, startTime + durationSec)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + durationSec)
  }

  // ── public API ───────────────────────────────────────────────────────

  /** Play a one-shot audio cue. */
  playCue(cue: AudioCue, volume = 0.25): void {
    const ctx = this.getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = cue.type ?? 'square'
    osc.frequency.value = cue.frequency
    gain.gain.value = volume
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + cue.durationMs / 1000)
  }

  /** Short high-pitched blip for a correctly typed key. */
  playKeypressOk(): void {
    const ctx = this.getContext()
    this.scheduleNote(ctx, 880, ctx.currentTime, 0.06, 0.15, 'square')
  }

  /** Low buzz for a mistyped key. */
  playKeypressError(): void {
    const ctx = this.getContext()
    this.scheduleNote(ctx, 140, ctx.currentTime, 0.15, 0.2, 'sawtooth')
  }

  /** Ascending C-major arpeggio played on stage clear. */
  playStageClear(): void {
    const ctx = this.getContext()
    const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      this.scheduleNote(ctx, freq, ctx.currentTime + i * 0.1, 0.18, 0.22)
    })
  }

  /** Descending notes played on game over. */
  playGameOver(): void {
    const ctx = this.getContext()
    const notes = [523, 466, 415, 349, 294] // C5 Bb4 Ab4 F4 D4
    notes.forEach((freq, i) => {
      this.scheduleNote(ctx, freq, ctx.currentTime + i * 0.18, 0.22, 0.25, 'square')
    })
  }

  /**
   * Set zombie proximity (0 = far away, 1 = right on top of the player).
   * Affects BGM tempo (up to 2× faster) and pitch (up to +30%) while BGM is running.
   */
  setZombieProximity(ratio: number): void {
    this.zombieProximity = Math.max(0, Math.min(1, ratio))
  }

  /** Start the looping chiptune BGM. No-op if already running. */
  startBgm(): void {
    if (this.bgmRunning) return
    this.bgmRunning = true
    this.bgmNoteIndex = 0
    this.tickBgm()
  }

  /** Stop the looping BGM. */
  stopBgm(): void {
    this.bgmRunning = false
    if (this.bgmTimeout !== null) {
      clearTimeout(this.bgmTimeout)
      this.bgmTimeout = null
    }
  }

  private tickBgm(): void {
    if (!this.bgmRunning) return

    const ctx = this.getContext()
    // Speed: 1× at proximity 0, up to 2× at proximity 1
    const speedMultiplier = 1 + this.zombieProximity
    const intervalMs = BGM_BASE_INTERVAL_MS / speedMultiplier
    // Pitch shift: +0% at proximity 0, +30% at proximity 1
    const pitchMultiplier = 1 + this.zombieProximity * 0.3
    const baseFreq = BGM_NOTES[this.bgmNoteIndex % BGM_NOTES.length]
    const freq = baseFreq * pitchMultiplier

    this.scheduleNote(ctx, freq, ctx.currentTime, (intervalMs * 0.65) / 1000, 0.1)
    this.bgmNoteIndex++
    this.bgmTimeout = setTimeout(() => this.tickBgm(), intervalMs)
  }
}
