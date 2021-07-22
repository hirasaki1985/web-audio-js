import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel from './models/AudioModel'
import AudioListOrganism from './components/organisms/AudioListOrganism'
import {
  AudioBufferList,
  AudioCurrentState,
  AudioEffector,
  AudioListItemParam,
  AudioListViewParam,
  AudioViewEffectorBaseRefProps,
  ObjectPosition,
} from './@types/AudioType'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'
import DragAreaOrganism from './components/organisms/DragAreaOrganism'
import EffectorListOrganism from './components/organisms/EffectorListOrganism'

/**
 *
 */
const firstLoadWav = 'fanfare.wav'

/**
 * view consts
 */
const magnification = 1 // 周波数表示の倍率
const nameWidth = 150 // 名前表示部分のwidth
const frequencyItemWidth = 500 * magnification // 周波数表示部分のwidth
const frequencyLeftMargin = '1em'
const secondPixel = 80 // 一秒間のピクセル
const frequencyHeight = 50 // 周波数表示の高さ

/**
 * audio
 */
const audioModel = new AudioModel()

/**
 * App
 */
function App() {
  /**
   * current
   */
  // audio buffer list
  const [audioBufferList, setAudioBufferList] = useState<AudioBufferList[]>()

  // effectors
  const [effectorList, setEffectorList] = useState<
    AudioEffector<AudioViewEffectorBaseRefProps>[]
  >([])

  // audio list item param
  const [audioListItemParam, setAudioListItemParam] =
    useState<AudioListItemParam>({
      nameWidth,
      maxFrequencyWidth: 0,
    })

  // audio list view param
  const [audioListViewParam, setAudioListViewParam] =
    useState<AudioListViewParam>({
      frequencyHeight,
      frequencyItemWidth,
      frequencyLeftMargin,
      secondPixel,
      magnification,
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
    audioModel
      .loadAudio(_loadAudioFileResource, _loadAudioFileName, {
        success: (_buffer) => {
          console.log('success', _buffer)
          // update audio buffer list
          setAudioBufferList(
            audioModel.getApiSounds().map((_item) => ({
              apiSound: _item,
              width: _item.buffer?.duration
                ? getFrequencyWidth(_item.buffer.duration)
                : 0,
            })),
          )

          // audio list item param
          setAudioListItemParam({
            maxFrequencyWidth: getFrequencyWidth(audioModel.getMaxDuration()),
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
      audioModel.effectorFactory.getSimpleDelayEffector(
        'simple delay effector 1',
      ),
      audioModel.effectorFactory.getSimpleReverbEffector(
        'simple reverb effector 1',
      ),
    ]
    setEffectorList(_effectors)
  }, [])

  /**
   * on click start button
   */
  const onClickStartButton = async () => {
    await audioModel.playWithEffectors(
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
        audioListViewParam.magnification,
        audioListViewParam.secondPixel,
      ),
      outputPosition: _position,
    })
  }

  console.log({
    audioListItemParam,
  })

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
            audioList={audioBufferList || []}
            audioListItemParam={audioListItemParam}
            audioViewParam={audioListViewParam}
            currentState={audioCurrentState}
            frequencyOnMouseClick={frequencyOnMouseClick}
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
