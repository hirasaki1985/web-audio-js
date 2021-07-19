import SimpleDelayEffector from './SimpleDelayEffector/SimpleDelayEffector'

export default class EffectorFactory {
  private audioContext: AudioContext

  public constructor(audioContext: AudioContext) {
    this.audioContext = audioContext
  }

  public getSimpleDelayEffector(name: string): SimpleDelayEffector {
    return new SimpleDelayEffector(this.audioContext, name)
  }
}
