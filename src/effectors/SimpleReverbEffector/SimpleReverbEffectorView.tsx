import React, { useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

/**
 * props
 */
export interface SimpleReverbEffectorViewProps {
  ref?: any
  level: number
}

export interface SimpleReverbEffectorViewRefProps {
  getCurrentData: () => SimpleReverbEffectorViewProps
}

/**
 * SimpleReverbEffectorView
 */
const SimpleReverbEffectorView: React.FC<SimpleReverbEffectorViewProps> =
  React.forwardRef<
    SimpleReverbEffectorViewRefProps,
    SimpleReverbEffectorViewProps
  >((props, ref) => {
    const { level } = props

    // feedback gain
    const [currentLevel, setCurrentLevel] = useState(level)
    useEffect(() => {
      setCurrentLevel(level)
    }, [level])

    /**
     * ref
     */
    useImperativeHandle(ref, () => ({
      getCurrentData: (): SimpleReverbEffectorViewProps => ({
        level: currentLevel,
      }),
    }))
    return (
      <StyleContainer>
        <div className="delay-param-container">
          {/* delay time */}
          <div className="delay-param-list-item">
            <div className="title">level:</div>
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max="10"
              defaultValue={currentLevel}
              onChange={(event) => setCurrentLevel(Number(event.target.value))}
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
export default SimpleReverbEffectorView
