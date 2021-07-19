import React, { useState } from 'react'
import styled from 'styled-components'
import {
  AudioEffector,
  AudioViewEffectorBaseRefProps,
} from '../../@types/AudioType'

/**
 * types
 */
export interface EffectorListOrganismProps {
  effectors: AudioEffector<AudioViewEffectorBaseRefProps>[]
}

const EffectorListOrganism: React.FC<EffectorListOrganismProps> = (
  props: EffectorListOrganismProps,
) => {
  const { effectors } = props

  return (
    <StyleContainer>
      <ul className="effector-list-organism-list">
        {effectors.map((_effector) => (
          <li key={_effector.name} className="effector-list-organism-list-item">
            <div className="effector-name">{_effector.name}</div>
            <div>{_effector.viewEffector()}</div>
          </li>
        ))}
      </ul>
    </StyleContainer>
  )
}

const StyleContainer = styled.div`
  .effector-list-organism-list {
    > .effector-list-organism-list-item {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-start;
      min-height: 40px;

      .effector-name {
        padding: 16px;
        margin-right: 1em;

        background-color: beige;
        font-weight: bold;
      }
    }
  }
`

export default EffectorListOrganism
