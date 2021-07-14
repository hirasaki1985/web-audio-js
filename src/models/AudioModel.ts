export interface AudioLoadCallbacks {
  success: (buffer: AudioBuffer) => void
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
  public play = async (
    name: string,
    callbacks: { onEnd: () => void },
    when: number = 0,
    offset: number = 0,
  ) => {
    // const oscillator = this.audioContext.createOscillator()

    const sound = this.getSound(name)
    if (sound && sound.buffer) {
      const source = this.audioContext.createBufferSource()
      source.buffer = sound.buffer
      source.connect(this.audioContext.destination)
      source.onended = () => callbacks.onEnd()
      source.start(when, offset, sound.buffer.duration)
    }
  }

  /**
   * getApiSounds
   */
  public getApiSounds = (): ApiSound[] => this.apiSounds

  /**
   * getBuffer
   */
  public getBuffer = (name: string): AudioBuffer => {
    const sound = this.getSound(name)
    if (sound && sound.buffer) {
      return sound.buffer
    }

    return new AudioBuffer({
      length: 0,
      numberOfChannels: 0,
      sampleRate: 0,
    })
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

  public getMaxDuration = (): number =>
    this.getApiSounds().reduce((a, b) => {
      if (
        a.buffer == null ||
        a.buffer.duration == null ||
        b.buffer == null ||
        b.buffer.duration == null
      )
        return a
      return a.buffer.duration > b.buffer.duration ? a : b
    }).buffer?.duration || 0

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
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = async () => {
      await this.audioContext.decodeAudioData(
        request.response,

        /**
         * success
         */
        (buffer) => {
          // add to api sounds
          this.apiSounds.push({
            name,
            buffer,
          })

          if (callbacks) callbacks.success(buffer)
        },

        /**
         * error
         */
        (error) => {
          console.error('decodeAudioData error', error)
          if (callbacks) callbacks.error()
        },
      )
    }

    request.send()
  }
}
