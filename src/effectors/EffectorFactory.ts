import SimpleDelayEffector from './SimpleDelayEffector/SimpleDelayEffector'
import SimpleReverbEffector from './SimpleReverbEffector/SimpleReverbEffector'
import MasterEffector from './master/MasterEffector'

export default class EffectorFactory {
  private audioContext: AudioContext

  private master: MasterEffector

  /**
   * constructor
   */
  public constructor(audioContext: AudioContext) {
    this.audioContext = audioContext
    this.master = new MasterEffector(this.audioContext, 'master')
  }

  /**
   * master
   */
  public getMasterEffector(): MasterEffector {
    return this.master
  }

  /**
   * simple delay effector
   */
  public getSimpleDelayEffector(
    name: string,
    viewName: string = '',
  ): SimpleDelayEffector {
    return new SimpleDelayEffector(this.audioContext, name, viewName)
  }

  /**
   * simple reverb effector
   */
  public getSimpleReverbEffector(
    name: string,
    viewName: string = '',
  ): SimpleReverbEffector {
    return new SimpleReverbEffector(this.audioContext, name, viewName)
  }
}
