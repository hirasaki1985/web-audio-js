import React, { useEffect, useImperativeHandle, useState } from 'react'
import { AudioViewEffectorBaseRefProps } from '../../@types/AudioType'
import styled from 'styled-components'

/**
 * props
 */
export interface MasterEffectorViewProps {
  ref?: any
  masterVolume: number
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
  const { masterVolume } = props

  const [currentMasterVolume, setCurrentMasterVolume] = useState(masterVolume)
  useEffect(() => {
    setCurrentMasterVolume(masterVolume)
  }, [masterVolume])

  /**
   * ref
   */
  useImperativeHandle(ref, () => ({
    getCurrentData: (): MasterEffectorViewProps => ({
      masterVolume: currentMasterVolume,
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
          max="10"
          defaultValue={masterVolume}
          onChange={(event) =>
            setCurrentMasterVolume(Number(event.target.value))
          }
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
