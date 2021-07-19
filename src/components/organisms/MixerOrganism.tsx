import React from 'react'
import { AudioMasterParams } from '../../@types/AudioType'
import styled from 'styled-components'

export interface MixerOrganismProps {
  audioMasterParams: AudioMasterParams
}

const MixerOrganism: React.FC<MixerOrganismProps> = (
  props: MixerOrganismProps,
) => {
  const { audioMasterParams } = props

  return (
    <StyleContainer>
      <div>テスト</div>
    </StyleContainer>
  )
}

const StyleContainer = styled.div``
