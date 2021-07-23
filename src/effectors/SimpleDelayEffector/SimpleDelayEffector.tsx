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
    delayTime: 2,
    maxDelayTime: 3,
    feedbackGainValue: 0.5,
    // dryGainValue: 0.7, // 原音
    wetGainValue: 0.3, // エフェクトオン
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
  public getViewParameter(): SimpleDelayEffectorViewProps {
    console.log('SimpleDelayEffector getParameter()')
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
    const currentParams = this.getViewParameter()
    const delay = this.getAudioNode()

    // const dry = this.audioContext.createGain()
    const wet = this.audioContext.createGain()
    const feedback = this.audioContext.createGain()

    // dry.gain.value = currentParams.dryGainValue
    wet.gain.value = currentParams.wetGainValue
    feedback.gain.value = currentParams.feedbackGainValue

    delay.connect(feedback).connect(delay)

    return node.connect(delay).connect(wet)
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
