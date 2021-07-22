import AudioFrequencyAtom from '../atoms/AudioFrequencyAtom'
import AudioFrequencyHelper from '../../helpers/AudioFrequencyHelper'
import AudioFrequencyMemoryAtom from '../atoms/AudioFrequencyMemoryAtom'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import {
  TrackListItem,
  AudioCurrentState,
  TrackListItemViewParam,
  TrackListViewParam,
  ObjectPosition,
} from '../../@types/AudioType'

/**
 * types
 */
export interface AudioListOrganismProps {
  trackList: TrackListItem[]
  trackListItemViewParam: TrackListItemViewParam
  trackListViewParam: TrackListViewParam
  currentState: AudioCurrentState
  frequencyOnMouseClick: (position: ObjectPosition) => void
  onChangeTrackItemState: (_track: TrackListItem, _index: number) => void
}

const AudioListOrganism: React.FC<AudioListOrganismProps> = (
  props: AudioListOrganismProps,
) => {
  // props
  const {
    trackList,
    trackListItemViewParam,
    trackListViewParam,
    currentState,
    frequencyOnMouseClick,
    onChangeTrackItemState,
  } = props

  // state
  const [mousePosition, setMousePosition] = useState<ObjectPosition>({
    x: 0,
    y: 0,
  })
  const iconStyle: React.CSSProperties = { padding: 4, fontSize: 16 }

  const onMouseMoveOnChart = (_position: ObjectPosition) => {
    // console.log('AudioListOrganism onMouseMoveOnChart()', _position)
    setMousePosition(_position)
  }

  return (
    <StyledMain
      nameWidth={trackListItemViewParam.nameWidth}
      frequencyWidth={trackListItemViewParam.maxFrequencyWidth}
      frequencyHeight={trackListViewParam.frequencyHeight}
      frequencyLeftMargin={trackListViewParam.frequencyLeftMargin}
      mouseX={mousePosition.x}
      mouseY={mousePosition.y}
      currentAudioPositionX={currentState.outputPosition.x}
    >
      <ul className="audio-list">
        {trackList &&
          trackList.map((_audio, _index) => (
            <li key={_audio.track.name} className="audio-list-item">
              <span className="audio-left-container">
                <div className="audio-list-name">{_audio.track.name}</div>
                <div className="audio-list-state">
                  <div
                    className={`audio-list-state-icon ${
                      _audio.state.mute
                        ? 'audio-list-state-icon-active'
                        : 'audio-list-state-icon-inactive'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={_audio.state.mute ? faVolumeMute : faVolumeUp}
                      style={iconStyle}
                      onClick={() => {
                        _audio.state.mute = !_audio.state.mute
                        onChangeTrackItemState(_audio, _index)
                      }}
                    />
                  </div>
                </div>
              </span>
              <span className="audio-frequency">
                <AudioFrequencyAtom
                  plotData={AudioFrequencyHelper.convertPlotData(
                    _audio.track.buffer,
                  )}
                  width={_audio.state.width}
                  height={trackListViewParam.frequencyHeight}
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
          audioViewParam={trackListViewParam}
          nameWidth={trackListItemViewParam.nameWidth}
          maxFrequencyWidth={trackListItemViewParam.maxFrequencyWidth}
          secondPixel={trackListViewParam.secondPixel}
          magnification={trackListViewParam.magnification}
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
  frequencyLeftMargin: string
  mouseX: number
  mouseY: number
  currentAudioPositionX: number
}

const itemBottomMargin = '1em'

const StyledMain = styled.div<StyleMainProps>`
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
      margin-bottom: ${itemBottomMargin};

      min-height: ${(props) => props.frequencyHeight}px;
      max-height: ${(props) => props.frequencyHeight}px;

      > .audio-left-container {
        min-width: ${(props) => props.nameWidth}px;
        padding: 8px 0px 8px 8px;
        background-color: #bbc3ea;
        height: 100%;
        display: flex;
        align-content: flex-start;
        justify-content: flex-start;
        flex-direction: column;

        > .audio-list-name {
          width: 100%;
          font-weight: bold;
        }

        > .audio-list-state {
          width: 100%;
          height: 20px;
          padding-top: 4px;

          > .audio-list-state-icon {
            width: min-content;
            cursor: pointer;
          }

          > .audio-list-state-icon-active {
            background-color: rgba(80, 80, 79, 0.33);
            border-radius: 4px;
          }

          > .audio-list-state-icon-inactive {
            background-color: yellow;
            border-radius: 4px;
          }
        }
      }

      // audio-frequency
      > .audio-frequency {
        margin-left: ${(props) => props.frequencyLeftMargin};
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
          height: calc(
            ${(props) => props.frequencyHeight}px + ${itemBottomMargin}
          );
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
          height: calc(
            ${(props) => props.frequencyHeight}px + ${itemBottomMargin}
          );
          top: 0px;
          left: ${(props) => props.currentAudioPositionX}px;
          border-left: 2px blue solid;
        }
      }

      > .audio-current-position {
      }
    }
  }
`

export default AudioListOrganism
