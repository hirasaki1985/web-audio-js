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
