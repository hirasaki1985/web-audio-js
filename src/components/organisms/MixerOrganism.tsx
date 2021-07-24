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
      <div className="chain-list-container">
        {mixer.chains.map((_chain) => (
          <ul key={_chain.track.track.name} className="chain-list">
            <li className="chain-list-item chain-track-container">
              {/* track view name */}
              <div className="track-name">{_chain.track.track.viewName}</div>
            </li>

            {/* effectors */}
            {_chain.effectors.map((_effector) => (
              <li
                className="chain-list-item chain-effector-container"
                key={_effector.name}
              >
                <div className="effector-name">{_effector.viewName}</div>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="chain-master-container">master</div>
    </StyleContainer>
  )
}

const StyleContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;

  // chain list
  > .chain-list-container {
    > .chain-list {
      list-style: none;
      display: flex;

      // chain list item
      > .chain-list-item {
        border: 2px solid;
        border-radius: 2px;
        margin-right: 3em;
        position: relative;

        &::after {
          content: '->';
          position: absolute;
          top: 0.5px;
          right: -1.5em;
        }
      }

      // track container
      > .chain-track-container {
        border-color: #9eadf6;
        background-color: #bbc3ea;

        .track-name {
        }
      }

      // effector container
      > .chain-effector-container {
        border-color: #f1f1c2;
        background-color: beige;

        .effector-name {
        }
      }
    }
  }

  // master
  > .chain-master-container {
    height: 100px;
    width: 100px;
    background-color: lightblue;
    border: 2px solid #75bbd2;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export default MixerOrganism
