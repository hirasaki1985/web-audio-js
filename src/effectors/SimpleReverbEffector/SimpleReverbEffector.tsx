import { AudioEffector } from '../../@types/AudioType'
import SimpleReverbEffectorView, {
  SimpleReverbEffectorViewProps,
  SimpleReverbEffectorViewRefProps,
} from './SimpleReverbEffectorView'
import React, { createRef } from 'react'

export default class SimpleReverbEffector
  implements AudioEffector<SimpleReverbEffectorViewProps>
{
  private audioContext: AudioContext

  private viewEffectorRef = createRef<SimpleReverbEffectorViewRefProps>()

  private defaultViewProps: SimpleReverbEffectorViewProps = {
    dryGainValue: 0,
    wetGainValue: 10,
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
  public getViewParameter(): SimpleReverbEffectorViewProps {
    console.log('SimpleDelayEffector getParameter()')
    return this.defaultViewProps
  }

  /**
   * connect
   */
  public connect(node: AudioNode): AudioNode {
    return node
  }

  /**
   * getAudioNode
   */
  public getAudioNode(): AudioNode {
    const delay = this.audioContext.createConvolver()
    return delay
  }

  /**
   * view effector
   */
  public viewEffector() {
    return (
      <SimpleReverbEffectorView
        {...this.defaultViewProps}
        ref={this.viewEffectorRef}
      />
    )
  }
}
