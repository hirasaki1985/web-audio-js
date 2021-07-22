import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioController from './models/AudioModel'
import AudioListOrganism from './components/organisms/AudioListOrganism'
import {
  TrackListItem,
  AudioCurrentState,
  AudioEffector,
  TrackListItemViewParam,
  TrackListViewParam,
  AudioViewEffectorBaseRefProps,
  ObjectPosition,
} from './@types/AudioType'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'
import DragAreaOrganism from './components/organisms/DragAreaOrganism'
import EffectorListOrganism from './components/organisms/EffectorListOrganism'

/**
 * tmp
 */
const firstLoadWav = 'fanfare.wav'

/**
 * view const
 */
const magnification = 1 // 周波数表示の倍率
const nameWidth = 150 // 名前表示部分のwidth
const frequencyItemWidth = 500 * magnification // 周波数表示部分のwidth
const frequencyLeftMargin = '1em'
const secondPixel = 80 // 一秒間のピクセル
const frequencyHeight = 50 // 周波数表示の高さ

/**
 * audio controller
 */
const audioController = new AudioController()

/**
 * App
 */
function App() {
  /**
   * current
   */
  // rack list
  const [trackList, setTrackList] = useState<TrackListItem[]>([])

  // effectors
  const [effectorList, setEffectorList] = useState<
    AudioEffector<AudioViewEffectorBaseRefProps>[]
  >([])

  // track view param
  const [trackListViewParam, setTrackListViewParam] =
    useState<TrackListViewParam>({
      frequencyHeight,
      frequencyItemWidth,
      frequencyLeftMargin,
      secondPixel,
      magnification,
    })

  const [trackListItemViewParam, setTrackListItemViewParam] =
    useState<TrackListItemViewParam>({
      nameWidth,
      maxFrequencyWidth: 0,
    })

  // audio current state
  const [audioCurrentState, setAudioCurrentState] = useState<AudioCurrentState>(
    {
      timePosition: 0,
      outputPosition: {
        x: 0,
        y: 0,
      },
    },
  )

  // input
  const [playFileName, setPlayFileName] = useState(firstLoadWav)

  /**
   * getFrequencyWidth
   */
  const getFrequencyWidth = (_duration: number): number =>
    _duration * secondPixel * magnification

  /**
   * loadAudioFile
   */
  const loadAudioFile = (
    _loadAudioFileResource: string | ArrayBuffer,
    _loadAudioFileName: string,
  ) => {
    audioController
      .loadAudio(_loadAudioFileResource, _loadAudioFileName, {
        success: (_buffer) => {
          console.log('success', _buffer)
          // update audio buffer list
          setTrackList(
            audioController.getApiSounds().map((_item) => ({
              track: _item,
              state: {
                width: _item.buffer?.duration
                  ? getFrequencyWidth(_item.buffer.duration)
                  : 0,
                mute: false,
                volume: 50,
              },
            })),
          )

          // audio list item param
          setTrackListItemViewParam({
            maxFrequencyWidth: getFrequencyWidth(
              audioController.getMaxDuration(),
            ),
            nameWidth,
          })
        },
        error: () => {},
      })
      .then()
  }

  /**
   * initialize
   */
  useEffect(() => {
    loadAudioFile(`/audios/${firstLoadWav}`, firstLoadWav)

    // set effector list
    const _effectors = [
      audioController.effectorFactory.getSimpleDelayEffector(
        'simple delay effector 1',
      ),
      audioController.effectorFactory.getSimpleReverbEffector(
        'simple reverb effector 1',
      ),
    ]
    setEffectorList(_effectors)
  }, [])

  /**
   * on click start button
   */
  const onClickStartButton = async () => {
    await audioController.playWithEffectors(
      firstLoadWav,
      effectorList[0].getAudioNode(),
      {
        onEnd: () => {
          console.log('on end')
        },
      },
    )
    /*
    // start to play audio
    // await audioModel.play(
    await audioModel.playWithActiveSounds(
      // playFileName,
      {
        onEnd: () => {
          console.log('on end')
        },
      },
      0,
      audioCurrentState.timePosition,
    )
    */
  }

  /**
   * frequency: on mouse click
   */
  const frequencyOnMouseClick = async (_position: ObjectPosition) => {
    console.log('App frequencyOnMouseClick', _position)
    setAudioCurrentState({
      timePosition: AudioFrequencyHelper.convertTime(
        _position.x,
        trackListViewParam.magnification,
        trackListViewParam.secondPixel,
      ),
      outputPosition: _position,
    })
  }

  /**
   * onDragFile
   */
  const onDragFile = async (
    _file: File,
    _arrayBuffer: string | ArrayBuffer,
  ) => {
    // await audioModel.loadAudio(_arrayBuffer, _file.name)
    loadAudioFile(_arrayBuffer, _file.name)
  }

  /**
   * トラックの状態が変更された時
   *
   * @param _track
   * @param _index
   */
  const onChangeTrackItemState = (_track: TrackListItem, _index: number) => {
    console.log('App onChangeTrackItemState')
    console.log({
      _track,
      _index,
    })

    const _trackList = trackList.concat()
    _trackList[_index].state = _track.state
    setTrackList(_trackList)
  }

  return (
    <StyleContainer className="App">
      {/* header */}
      <div className="app-header">
        <button type="button" onClick={onClickStartButton}>
          再生
        </button>
        <input
          type="text"
          name="audio_file_path"
          value={playFileName}
          onChange={(e) => {
            setPlayFileName(e.target.value)
          }}
        />
        <input
          type="number"
          name="current_time_index"
          value={audioCurrentState.timePosition}
          min={0}
        />
      </div>

      {/* audio list */}
      <div className="audio-list">
        {/* audio list container */}
        <div className="audio-list-container">
          <AudioListOrganism
            trackList={trackList || []}
            trackListItemViewParam={trackListItemViewParam}
            trackListViewParam={trackListViewParam}
            currentState={audioCurrentState}
            frequencyOnMouseClick={frequencyOnMouseClick}
            onChangeTrackItemState={onChangeTrackItemState}
          />
        </div>

        {/* drag area container */}
        <div className="drag-area-container">
          <DragAreaOrganism onDragFile={onDragFile} />
        </div>
      </div>

      {/* effector list */}
      <div className="effector-list">
        <div className="effector-list-container">
          <EffectorListOrganism effectors={effectorList} />
        </div>
      </div>
    </StyleContainer>
  )
}

export default App

const StyleContainer = styled.div`
  height: 100%;

  > .app-header {
  }

  > .audio-list {
    width: 100%;
    background-color: #ecf3f8;
    padding: 1em;

    > .audio-list-container {
      padding-bottom: 1em;
    }

    > .drag-area-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .effector-list-container {
    padding-bottom: 1em;
  }
`
