import React, { useEffect, useImperativeHandle, useState } from 'react'
import { AudioViewEffectorBaseRefProps } from '../../@types/AudioType'
import styled from 'styled-components'

/**
 * props
 */
export interface MasterEffectorViewProps {
  ref?: any
  delayTime: number
  maxDelayTime: number
  feedbackGainValue: number
  // dryGainValue: number // 原音音量
  wetGainValue: number // エフェクトオン
}

export interface MasterEffectorViewRefProps
  extends AudioViewEffectorBaseRefProps {
  getCurrentData: () => MasterEffectorViewProps
}

/**
 * MasterEffectorView
 */
const MasterEffectorView: React.FC<MasterEffectorViewProps> = React.forwardRef<
  MasterEffectorViewRefProps,
  MasterEffectorViewProps
>((props, ref) => {
  const { delayTime, maxDelayTime } = props

  const [currentDelayTime, setCurrentDelayTime] = useState(delayTime)
  useEffect(() => {
    setCurrentDelayTime(delayTime)
  }, [delayTime])

  /**
   * ref
   */
  useImperativeHandle(ref, () => ({
    getCurrentData: (): MasterEffectorViewProps => ({
      delayTime: currentDelayTime,
      maxDelayTime,
      feedbackGainValue: 0,
      wetGainValue: 0,
    }),
  }))

  return (
    <StyleContainer>
      <div className="title">volume:</div>
      <div className="delay-param-container">
        <input
          type="range"
          id="points"
          name="points"
          min="0"
          max={maxDelayTime}
          defaultValue={delayTime}
          onChange={(event) => setCurrentDelayTime(Number(event.target.value))}
        />
      </div>
    </StyleContainer>
  )
})

/**
 * Style
 */
const StyleContainer = styled.div`
  display: flex;
`

export default MasterEffectorView
