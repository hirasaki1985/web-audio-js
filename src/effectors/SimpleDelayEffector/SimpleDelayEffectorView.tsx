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
}

export interface SimpleDelayEffectorViewRefProps
  extends AudioViewEffectorBaseRefProps {
  getCurrentData: () => SimpleDelayEffectorViewProps
}

const SimpleDelayEffectorView: React.FC<SimpleDelayEffectorViewProps> =
  React.forwardRef<
    SimpleDelayEffectorViewRefProps,
    SimpleDelayEffectorViewProps
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
      getCurrentData: (): SimpleDelayEffectorViewProps => ({
        delayTime: currentDelayTime,
        maxDelayTime,
      }),
    }))

    return (
      <StyleContainer>
        <div className="title">delay time:</div>
        <div className="delay-param-container">
          <input
            type="range"
            id="points"
            name="points"
            min="0"
            max={maxDelayTime}
            defaultValue={delayTime}
            onChange={(event) =>
              setCurrentDelayTime(Number(event.target.value))
            }
          />
        </div>
      </StyleContainer>
    )
  })

const StyleContainer = styled.div`
  display: flex;
`

export default SimpleDelayEffectorView