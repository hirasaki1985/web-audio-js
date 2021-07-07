export interface AudioLoadCallbacks {
  success: () => void
  error: () => void
}

export interface ApiSound {
  name: string
  buffer: AudioBuffer | null
}

export default class AudioModel {
  private audioContext = new AudioContext()

  private apiSounds: ApiSound[]

  constructor() {
    this.apiSounds = []
  }

  /**
   * play
   */
  public play = async (name: string) => {
    const sound = this.getSound(name)
    if (sound) {
      const source = this.audioContext.createBufferSource()
      source.buffer = sound.buffer
      source.connect(this.audioContext.destination)
      source.start(0)
    }
  }

  /**
   * get analyser
   */
  public getAnalyser = (): AnalyserNode => {
    const analyser = this.audioContext.createAnalyser()
    // Create the instance of OscillatorNode
    const oscillator = this.audioContext.createOscillator()

    // for legacy browsers
    // oscillator.start = oscillator.start || oscillator.noteOn
    // oscillator.stop = oscillator.stop || oscillator.noteOff
    // OscillatorNode (Input) -> AnalyserNode (Visualization) -> AudioDestinationNode (Output)
    oscillator.connect(analyser)
    analyser.connect(this.audioContext.destination)

    return analyser
  }

  /**
   * get sound
   */
  public getSound = (name: string): ApiSound | undefined =>
    this.apiSounds.find((_item) => _item.name === name)

  /**
   * loadAudio
   */
  public loadAudio = async (
    url: string,
    name: string,
    callbacks: AudioLoadCallbacks | undefined = undefined,
  ) => {
    const request = new XMLHttpRequest()
    let audioBuffer: AudioBuffer | null = null
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = async () => {
      await this.audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          audioBuffer = buffer
          if (callbacks) callbacks.success()
        },
        (error) => {
          console.error('decodeAudioData error', error)
          if (callbacks) callbacks.error()
        },
      )

      this.apiSounds.push({
        name,
        buffer: audioBuffer,
      })
    }

    request.send()
  }
}
