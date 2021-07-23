import React, { useEffect, useImperativeHandle, useState } from 'react'
import { AudioViewEffectorBaseRefProps } from '../../@types/AudioType'
import styled from 'styled-components'

/**
 * props
 */
export interface SimpleDelayEffectorViewProps {
  ref?: any
  delayTime: number
  maxDelayTime: number
  feedbackGainValue: number
  // dryGainValue: number // 原音音量
  wetGainValue: number // エフェクトオン
}

export interface SimpleDelayEffectorViewRefProps
  extends AudioViewEffectorBaseRefProps {
  getCurrentData: () => SimpleDelayEffectorViewProps
}

/**
 * SimpleDelayEffectorView
 */
const SimpleDelayEffectorView: React.FC<SimpleDelayEffectorViewProps> =
  React.forwardRef<
    SimpleDelayEffectorViewRefProps,
    SimpleDelayEffectorViewProps
  >((props, ref) => {
    const { delayTime, maxDelayTime, feedbackGainValue, wetGainValue } = props

    // delay time
    const [currentDelayTime, setCurrentDelayTime] = useState(delayTime)
    useEffect(() => {
      setCurrentDelayTime(delayTime)
    }, [delayTime])

    // max delay time
    const [currentMaxDelayTime, setCurrentMacDelayTime] = useState(maxDelayTime)
    useEffect(() => {
      setCurrentMacDelayTime(maxDelayTime)
    }, [maxDelayTime])

    // feedback gain
    const [currentFeedbackGain, setCurrentFeedbackGain] =
      useState(feedbackGainValue)
    useEffect(() => {
      setCurrentFeedbackGain(feedbackGainValue)
    }, [feedbackGainValue])

    // wet gain
    const [currentWetGain, setCurrentWetGain] = useState(wetGainValue)
    useEffect(() => {
      setCurrentWetGain(wetGainValue)
    }, [wetGainValue])

    /**
     * ref
     */
    useImperativeHandle(ref, () => ({
      getCurrentData: (): SimpleDelayEffectorViewProps => ({
        delayTime: currentDelayTime,
        maxDelayTime: currentMaxDelayTime,
        feedbackGainValue: currentFeedbackGain,
        wetGainValue: currentWetGain,
      }),
    }))

    return (
      <StyleContainer>
        <div className="delay-param-container">
          {/* delay time */}
          <div className="delay-param-list-item">
            <div className="title">delay time:</div>
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max="10"
              defaultValue={currentDelayTime}
              onChange={(event) =>
                setCurrentDelayTime(Number(event.target.value))
              }
            />
          </div>

          {/* max delay time */}
          <div className="delay-param-list-item">
            <div className="title">max delay time:</div>
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max="10"
              defaultValue={currentMaxDelayTime}
              onChange={(event) =>
                setCurrentMacDelayTime(Number(event.target.value))
              }
            />
          </div>

          {/* feedback gain */}
          <div className="delay-param-list-item">
            <div className="title">feedback gain:</div>
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max="1"
              step={0.1}
              defaultValue={currentFeedbackGain}
              onChange={(event) =>
                setCurrentFeedbackGain(Number(event.target.value))
              }
            />
          </div>

          {/* wet gain */}
          <div className="delay-param-list-item">
            <div className="title">wet gain:</div>
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max="1"
              step={0.1}
              defaultValue={currentWetGain}
              onChange={(event) =>
                setCurrentWetGain(Number(event.target.value))
              }
            />
          </div>
        </div>
      </StyleContainer>
    )
  })

/**
 * Style
 */
const StyleContainer = styled.div`
  display: flex;

  > .delay-param-container {
    display: flex;

    > .delay-param-list-item {
      display: flex;
      margin-right: 1em;
    }
  }
`

export default SimpleDelayEffectorView
