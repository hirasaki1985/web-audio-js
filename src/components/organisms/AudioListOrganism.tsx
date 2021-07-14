import AudioFrequencyAtom from '../atoms/AudioFrequencyAtom'
import AudioFrequencyHelper from '../../helpers/AudioFrequencyHelper'
import AudioFrequencyMemoryAtom from '../atoms/AudioFrequencyMemoryAtom'
import React, { useState } from 'react'
import styled from 'styled-components'
import {
  AudioBufferList,
  AudioCurrentState,
  AudioListItemParam,
  AudioListViewParam,
  ObjectPosition,
} from '../../@types/AudioType'

/**
 * types
 */
export interface AudioListOrganismProps {
  audioList: AudioBufferList[]
  audioListItemParam: AudioListItemParam
  audioViewParam: AudioListViewParam
  currentState: AudioCurrentState
  frequencyOnMouseClick: (position: ObjectPosition) => void
}

const AudioListOrganism: React.FC<AudioListOrganismProps> = (
  props: AudioListOrganismProps,
) => {
  // props
  const {
    audioList,
    audioListItemParam,
    audioViewParam,
    currentState,
    frequencyOnMouseClick,
  } = props

  // state
  const [mousePosition, setMousePosition] = useState<ObjectPosition>({
    x: 0,
    y: 0,
  })

  const onMouseMoveOnChart = (_position: ObjectPosition) => {
    // console.log('AudioListOrganism onMouseMoveOnChart()', _position)
    setMousePosition(_position)
  }

  return (
    <StyledMain
      nameWidth={audioListItemParam.nameWidth}
      frequencyWidth={audioListItemParam.maxFrequencyWidth}
      frequencyHeight={audioViewParam.frequencyHeight}
      mouseX={mousePosition.x}
      mouseY={mousePosition.y}
      currentAudioPositionX={currentState.outputPosition.x}
    >
      <ul className="audio-list">
        {audioList &&
          audioList.map((_audio) => (
            <li key={_audio.apiSound.name} className="audio-list-item">
              <span className="audio-list-name">{_audio.apiSound.name}</span>
              <span className="audio-frequency">
                <AudioFrequencyAtom
                  plotData={AudioFrequencyHelper.convertPlotData(
                    _audio.apiSound.buffer,
                  )}
                  width={_audio.width}
                  height={audioViewParam.frequencyHeight}
                  onMouseMove={onMouseMoveOnChart}
                  onMouseClick={frequencyOnMouseClick}
                />
                {currentState.outputPosition.x > 0 && (
                  <span className="audio-current-position" />
                )}
              </span>
            </li>
          ))}
        <AudioFrequencyMemoryAtom
          nameWidth={audioListItemParam.nameWidth}
          maxFrequencyWidth={audioListItemParam.maxFrequencyWidth}
          secondPixel={audioViewParam.secondPixel}
          magnification={audioViewParam.magnification}
        />
      </ul>
    </StyledMain>
  )
}

/**
 * style
 */
interface StyleMainProps {
  nameWidth: number
  frequencyWidth: number
  frequencyHeight: number
  mouseX: number
  mouseY: number
  currentAudioPositionX: number
}

const StyledMain = styled.div<StyleMainProps>`
  height: 500px;

  > .audio-list {
    min-width: 100px;
    height: 100%;
    list-style-type: none;

    // list
    > .audio-list-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;

      min-height: ${(props) => props.frequencyHeight}px;
      > .audio-list-name {
        font-weight: bold;
        min-width: ${(props) => props.nameWidth}px;
      }

      // audio-frequency
      > .audio-frequency {
        min-height: ${(props) => props.frequencyHeight}px;
        min-width: ${(props) => props.frequencyWidth}px;
        height: ${(props) => props.frequencyHeight}px;
        position: relative;

        // mouse position
        &::before {
          content: '';
          position: absolute;
          width: 1px;
          top: 0px;
          left: ${(props) => props.mouseX}px;
          height: ${(props) => props.frequencyHeight}px;
        }

        &:hover::before {
          --size: 0px;
          border-left: 1px black solid;
        }

        // current audio position
        > .audio-current-position {
          content: '';
          position: absolute;
          width: 1px;
          top: 0px;
          left: ${(props) => props.currentAudioPositionX}px;
          height: ${(props) => props.frequencyHeight}px;
          border-left: 2px blue solid;
        }
      }

      > .audio-current-position {
      }
    }
  }
`

export default AudioListOrganism
