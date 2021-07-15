import { ApiSound } from '../@types/AudioType'
import ArrayUtil from '../Utils/ArrayUtil'

export interface AudioLoadCallbacks {
  success: (buffer: AudioBuffer) => void
  error: () => void
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
      this.playAudioBuffer(sound.buffer, callbacks, when, offset)
    }
  }

  /**
   * playWithActiveSounds
   */
  public playWithActiveSounds = async (
    callbacks: { onEnd: () => void },
    when: number = 0,
    offset: number = 0,
  ) => {
    const audioBuffer = this.getMergedAudioBuffer()
    this.playAudioBuffer(audioBuffer, callbacks, when, offset)
  }

  /**
   * playAudioBuffer
   */
  private playAudioBuffer = (
    audioBuffer: AudioBuffer,
    callbacks: { onEnd: () => void },
    when: number = 0,
    offset: number = 0,
  ) => {
    const source = this.audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination)
    source.onended = () => callbacks.onEnd()
    source.start(when, offset, audioBuffer.duration)
  }

  /**
   * getMergedAudioBuffer
   */
  public getMergedAudioBuffer = (): AudioBuffer => {
    const audioBuffers = this.getArrayBuffers()
    let maxChannels = 0
    let maxDuration = 0
    for (let i = 0; i < audioBuffers.length; i += 1) {
      if (audioBuffers[i].numberOfChannels > maxChannels) {
        maxChannels = audioBuffers[i].numberOfChannels
      }
      if (audioBuffers[i].duration > maxDuration) {
        maxDuration = audioBuffers[i].duration
      }
    }
    const out = this.audioContext.createBuffer(
      maxChannels,
      this.audioContext.sampleRate * maxDuration,
      this.audioContext.sampleRate,
    )

    for (let j = 0; j < audioBuffers.length; j += 1) {
      for (
        let srcChannel = 0;
        srcChannel < audioBuffers[j].numberOfChannels;
        srcChannel += 1
      ) {
        const outt = out.getChannelData(srcChannel)
        const inn = audioBuffers[j].getChannelData(srcChannel)
        for (let i = 0; i < inn.length; i += 1) {
          outt[i] += inn[i]
        }
        out.getChannelData(srcChannel).set(outt, 0)
      }
    }
    return out
  }

  /**
   * getApiSounds
   */
  public getApiSounds = (): ApiSound[] => this.apiSounds

  /**
   * getArrayBuffers
   */
  public getArrayBuffers = (): AudioBuffer[] =>
    this.apiSounds.map((_item) => _item.buffer).filter(ArrayUtil.nonNullable)

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
    resource: string | ArrayBuffer,
    audioName: string,
    callbacks: AudioLoadCallbacks | undefined = undefined,
  ) => {
    // validate
    if (resource == null) return

    /**
     * _decodeAudioData
     */
    const _decodeAudioData = async (
      _decodeName: string,
      _decodeBuffer: ArrayBuffer,
    ) => {
      await this.audioContext.decodeAudioData(
        _decodeBuffer,

        /**
         * success
         */
        (_decodeResultBuffer) => {
          // add to api sounds
          this.apiSounds.push({
            name: _decodeName,
            buffer: _decodeResultBuffer,
          })

          if (callbacks) callbacks.success(_decodeResultBuffer)
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

    // string
    if (typeof resource === 'string') {
      const request = new XMLHttpRequest()
      request.open('GET', resource, true)
      request.responseType = 'arraybuffer'

      request.onload = async () => {
        const responseBuffer = request.response
        await _decodeAudioData(audioName, responseBuffer)
      }

      request.send()
      // array buffer
    } else {
      console.log('loadAudio() array buffer')
      await _decodeAudioData(audioName, resource)
    }
  }
}
