import React, { createRef } from 'react'
import { AudioEffector } from '../../@types/AudioType'
import MasterEffectorView, {
  MasterEffectorViewProps,
  MasterEffectorViewRefProps,
} from './MasterEffectorView'

export default class MasterEffector
  implements AudioEffector<MasterEffectorViewProps>
{
  private audioContext: AudioContext

  private viewEffectorRef = createRef<MasterEffectorViewRefProps>()

  private defaultViewProps: MasterEffectorViewProps = {
    masterVolume: 5,
  }

  // public
  public name: string = ''

  public viewName: string = ''

  public constructor(
    audioContext: AudioContext,
    name: string,
    viewName: string = '',
  ) {
    this.name = name
    this.audioContext = audioContext
    this.viewName = viewName == null || viewName === '' ? this.name : viewName
  }

  /**
   * getViewParameter
   */
  public getViewParameter(): MasterEffectorViewProps {
    console.log('MasterEffector getParameter()')
    console.log(this.viewEffectorRef.current?.getCurrentData())
    if (this.viewEffectorRef.current?.getCurrentData) {
      return this.viewEffectorRef.current?.getCurrentData()
    }

    return this.defaultViewProps
  }

  /**
   * connect
   */
  public connect(node: AudioNode): AudioNode {
    const master = this.getAudioNode()

    return node.connect(master)
  }

  /**
   * getAudioNode
   */
  public getAudioNode(): AudioNode {
    const currentParams = this.getViewParameter()
    const master = this.audioContext.createGain()
    master.gain.value = currentParams.masterVolume
    return master
  }

  /**
   * view effector
   */
  public viewEffector() {
    return (
      <MasterEffectorView
        {...this.defaultViewProps}
        ref={this.viewEffectorRef}
      />
    )
  }
}
