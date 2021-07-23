import React from 'react'
import { AudioMasterParams, AudioMixer } from '../../@types/AudioType'
import styled from 'styled-components'

export interface MixerOrganismProps {
  mixer: AudioMixer
}

const MixerOrganism: React.FC<MixerOrganismProps> = (
  props: MixerOrganismProps,
) => {
  const { mixer } = props

  return (
    <StyleContainer>
      {mixer.chains.map((_chain) => (
        <div key={_chain.track.track.name}>
          <div>{_chain.track.track.viewName}</div>
          {_chain.effectors.map((_effector) => (
            <div key={_effector.name}>{_effector.viewName}</div>
          ))}
        </div>
      ))}
    </StyleContainer>
  )
}

const StyleContainer = styled.div``

export default MixerOrganism
