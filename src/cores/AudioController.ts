import { AudioMixer, AudioMixerChain, Track } from '../@types/AudioType'
import ArrayUtil from '../Utils/ArrayUtil'
import EffectorFactory from '../effectors/EffectorFactory'

/**
 * interfaces
 */
export interface AudioLoadCallbacks {
  success: (track: Track) => void
  error: () => void
}

/**
 * AudioController
 */
export default class AudioController {
  // audio context
  private audioContext = new AudioContext()

  // api sound
  private apiSounds: Track[]

  // effector
  public effectorFactory: EffectorFactory

  constructor() {
    this.apiSounds = []
    this.effectorFactory = new EffectorFactory(this.audioContext)
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
    const audioBuffer = this.getMergedAudioBuffer(this.getArrayBuffers())
    this.playAudioBuffer(audioBuffer, callbacks, when, offset)
  }

  /**
   * playWithMixer
   */
  public playWithMixer = async (
    mixer: AudioMixer,
    callbacks: { onEnd: (chain: AudioMixerChain) => void },
    when: number = 0,
    offset: number = 0,
  ) => {
    console.log('AudioController playWithMixer()')
    console.log({
      mixer,
      when,
      offset,
    })
    // validate
    if (mixer == null || mixer.chains == null || mixer.chains.length === 0)
      return

    // create master
    const master = mixer.master.getAudioNode()
    master.connect(this.audioContext.destination)

    // set effectors
    const sources: {
      node: AudioBufferSourceNode
      connect: AudioNode
      chain: AudioMixerChain
    }[] = []

    mixer.chains.forEach((_chain) => {
      console.log('mixer.chains.forEach', _chain)

      // validate
      if (_chain.track.track.buffer == null) return

      // mute
      if (_chain.track.state.mute) return

      // create source
      const buffer = this.getMergedAudioBuffer([_chain.track.track.buffer])
      const source: AudioBufferSourceNode =
        this.audioContext.createBufferSource()
      source.buffer = buffer

      console.log({
        buffer,
        source,
      })

      // connect
      let connects: AudioNode = source
      _chain.effectors.forEach((_effector) => {
        connects = _effector.connect(connects)
      })

      sources.push({
        node: source,
        connect: connects,
        chain: _chain,
      })
    })

    console.log({
      sources,
    })

    // connect to master, play
    sources.forEach((_source) => {
      // validate
      if (_source.node == null || _source.node.buffer == null) return
      _source.connect.connect(master)

      // play
      _source.node.onended = () => callbacks.onEnd(_source.chain)
      _source.node.start(when, offset, _source.node.buffer.duration)
    })
  }

  /**
   * playWithEffectors
   */
  public playWithEffectors = async (
    name: string,
    effector: AudioNode,
    callbacks: { onEnd: () => void },
    when: number = 0,
    offset: number = 0,
  ) => {
    const sound = this.getSound(name)

    if (sound && sound.buffer) {
      console.log('playWithEffectors name = ', name)
      console.log({
        effector,
        sound,
      })

      // const
      const masterGainValue = 0.8
      const delayTimeValue = 2
      const delayMaxDelayTime = 5
      const feedbackGainValue = 0.5
      const dryGainValue = 0.7 // 原音
      const wetGainValue = 0.3 // エフェクトオン

      // master
      const master = this.audioContext.createGain()
      master.gain.value = masterGainValue

      // get buffer
      const buffer = this.getMergedAudioBuffer([sound.buffer])

      // delay
      const delay = this.audioContext.createDelay(delayMaxDelayTime)
      delay.delayTime.value = delayTimeValue

      const dry = this.audioContext.createGain()
      const wet = this.audioContext.createGain()
      const feedback = this.audioContext.createGain()

      dry.gain.value = dryGainValue
      wet.gain.value = wetGainValue
      feedback.gain.value = feedbackGainValue

      // create buffer source
      const source: AudioBufferSourceNode =
        this.audioContext.createBufferSource()
      source.buffer = buffer

      // base sound -> dry -> master
      source.connect(dry).connect(master)

      // base sound -> delay -> wet -> master
      source.connect(delay).connect(wet).connect(master)

      // delay -> feedback -> delay
      delay.connect(feedback).connect(delay)

      // master
      master.connect(this.audioContext.destination)

      // play
      source.onended = () => callbacks.onEnd()
      source.start(when, offset, buffer.duration)
      // oscillator.start(when)
    }
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
    const source: AudioBufferSourceNode = this.audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination)
    source.onended = () => callbacks.onEnd()
    source.start(when, offset, audioBuffer.duration)
  }

  /**
   * getMergedAudioBuffer
   */
  public getMergedAudioBuffer = (audioBuffers: AudioBuffer[]): AudioBuffer => {
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
  public getApiSounds = (): Track[] => this.apiSounds

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

    // OscillatorNode (Input) -> AnalyserNode (Visualization) -> AudioDestinationNode (Output)
    oscillator.connect(analyser)
    analyser.connect(this.audioContext.destination)

    return analyser
  }

  /**
   * getMaxDuration
   */
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
  public getSound = (name: string): Track | undefined =>
    this.apiSounds.find((_item) => _item.name === name)

  /**
   * loadAudio
   */
  public loadAudio = async (
    resource: string | ArrayBuffer,
    audioName: string,
    viewName: string,
    callbacks: AudioLoadCallbacks | undefined = undefined,
  ) => {
    // validate
    if (resource == null) return

    /**
     * _decodeAudioData
     */
    const _decodeAudioData = async (
      _decodeName: string,
      _decodeViewName: string,
      _decodeBuffer: ArrayBuffer,
    ) => {
      await this.audioContext.decodeAudioData(
        _decodeBuffer,

        /**
         * success
         */
        (_decodeResultBuffer) => {
          const _track: Track = {
            name: _decodeName,
            viewName: _decodeViewName,
            buffer: _decodeResultBuffer,
          }
          // add to api sounds
          this.apiSounds.push(_track)

          if (callbacks) callbacks.success(_track)

          return _track
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
        await _decodeAudioData(audioName, viewName, responseBuffer)
      }

      request.send()
      // array buffer
    } else {
      console.log('loadAudio() array buffer')
      await _decodeAudioData(audioName, viewName, resource)
    }
  }
}
