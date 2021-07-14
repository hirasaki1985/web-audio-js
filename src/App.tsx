import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel from './models/AudioModel'
import AudioListOrganism from './components/organisms/AudioListOrganism'
import {
  AudioBufferList,
  AudioCurrentState,
  AudioListItemParam,
  AudioListViewParam,
  ObjectPosition,
} from './@types/AudioType'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'

const nameWidth = 100

/**
 * view consts
 */
const magnification = 1 // 周波数表示の倍率
const frequencyItemWidth = 500 * magnification // 周波数表示部分のwidth
const secondPixel = 300 // 一秒間のピクセル
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
  const [audioBufferList, setAudioBufferList] = useState<AudioBufferList[]>()
  const [audioListItemParam, setAudioListItemParam] =
    useState<AudioListItemParam>({
      nameWidth,
      maxFrequencyWidth: 0,
    })
  const [audioListViewParam, setAudioListViewParam] =
    useState<AudioListViewParam>({
      frequencyHeight,
      frequencyItemWidth,
      secondPixel,
      magnification,
    })
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
  const audioName = 'piano.wav'
  const [wavFilePath, setWavFilePath] = useState('/audios/piano.wav')

  /**
   * getFrequencyWidth
   */
  const getFrequencyWidth = (_duration: number): number =>
    _duration * secondPixel * magnification

  /**
   * initialize
   */
  useEffect(() => {
    audioModel
      .loadAudio(wavFilePath, audioName, {
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
  }, [])

  /**
   * on click start button
   */
  const onClickStartButton = async () => {
    await audioModel.play(
      audioName,
      {
        onEnd: () => {
          console.log('on end')
        },
      },
      0,
      audioCurrentState.timePosition,
    )
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

  return (
    <div className="App">
      <StyleHeader className="App-header">
        <button type="button" onClick={onClickStartButton}>
          再生
        </button>
        <input
          type="text"
          name="audio_file_path"
          value={wavFilePath}
          onChange={(e) => {
            setWavFilePath(e.target.value)
          }}
        />
        <input
          type="number"
          name="current_time_index"
          value={audioCurrentState.timePosition}
          min={0}
        />
      </StyleHeader>
      <AudioListOrganism
        audioList={audioBufferList || []}
        audioListItemParam={audioListItemParam}
        audioViewParam={audioListViewParam}
        currentState={audioCurrentState}
        frequencyOnMouseClick={frequencyOnMouseClick}
      />
    </div>
  )
}

export default App

const StyleHeader = styled.div``
