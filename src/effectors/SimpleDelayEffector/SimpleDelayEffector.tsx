import React, { createRef } from 'react'
import { AudioEffector } from '../../@types/AudioType'
import SimpleDelayEffectorView, {
  SimpleDelayEffectorViewProps,
  SimpleDelayEffectorViewRefProps,
} from './SimpleDelayEffectorView'

export default class SimpleDelayEffector
  implements AudioEffector<SimpleDelayEffectorViewProps>
{
  private audioContext: AudioContext

  private viewEffectorRef = createRef<SimpleDelayEffectorViewRefProps>()

  private defaultViewProps: SimpleDelayEffectorViewProps = {
    delayTime: 0,
    maxDelayTime: 10,
  }

  // public
  public name: string = ''

  public constructor(audioContext: AudioContext, name: string) {
    this.name = name
    this.audioContext = audioContext
  }

  /**
   * getViewParameter
   */
  public getViewParameter(): SimpleDelayEffectorViewProps {
    console.log('SimpleDelayEffector getParameter()')
    console.log(this.viewEffectorRef.current?.getCurrentData())
    if (this.viewEffectorRef.current?.getCurrentData) {
      return this.viewEffectorRef.current?.getCurrentData()
    }

    return this.defaultViewProps
  }

  /**
   * getAudioNode
   */
  public getAudioNode(): AudioNode {
    const delay = this.audioContext.createDelay(
      this.defaultViewProps.maxDelayTime,
    )
    return delay
  }

  /**
   * view effector
   */
  public viewEffector() {
    return (
      <SimpleDelayEffectorView
        {...this.defaultViewProps}
        ref={this.viewEffectorRef}
      />
    )
  }
}
