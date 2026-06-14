export interface AudioCue {
  frequency: number
  durationMs: number
  type?: OscillatorType
}

export class ChiptuneAudioManager {
  private context: AudioContext | null = null

  playCue(cue: AudioCue, volume = 0.25): void {
    this.context ??= new AudioContext()
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = cue.type ?? 'square'
    oscillator.frequency.value = cue.frequency
    gain.gain.value = volume
    oscillator.connect(gain)
    gain.connect(this.context.destination)
    oscillator.start()
    oscillator.stop(this.context.currentTime + cue.durationMs / 1000)
  }
}
