import React, { useImperativeHandle } from 'react'
import styled from 'styled-components'

/**
 * props
 */
export interface SimpleReverbEffectorViewProps {
  ref?: any
  dryGainValue: number
  wetGainValue: number
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
    const { dryGainValue, wetGainValue } = props

    /**
     * ref
     */
    useImperativeHandle(ref, () => ({
      getCurrentData: (): SimpleReverbEffectorViewProps => ({
        dryGainValue: 0,
        wetGainValue: 0,
      }),
    }))
    return <StyleContainer />
  })

/**
 * Style
 */
const StyleContainer = styled.div`
  display: flex;
`
export default SimpleReverbEffectorView
