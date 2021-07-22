import SimpleDelayEffector from './SimpleDelayEffector/SimpleDelayEffector'
import SimpleReverbEffector from './SimpleReverbEffector/SimpleReverbEffector'

export default class EffectorFactory {
  private audioContext: AudioContext

  public constructor(audioContext: AudioContext) {
    this.audioContext = audioContext
  }

  public getSimpleDelayEffector(name: string): SimpleDelayEffector {
    return new SimpleDelayEffector(this.audioContext, name)
  }

  public getSimpleReverbEffector(name: string): SimpleReverbEffector {
    return new SimpleReverbEffector(this.audioContext, name)
  }
}
