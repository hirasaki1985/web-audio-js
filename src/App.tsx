import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel, { ApiSound } from './models/AudioModel'
import AudioFrequencyAtom from './components/atoms/AudioFrequencyAtom'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'

function App() {
  const audioName = 'piano.wav'
  const [audioModel, setAudioModel] = useState(new AudioModel())
  const [wavFilePath, setWavFilePath] = useState('/audios/piano.wav')
  const [audioBufferList, setAudioBufferList] = useState<ApiSound[]>()

  useEffect(() => {
    audioModel
      .loadAudio(wavFilePath, audioName, {
        success: () => {
          console.log('success')
          setAudioBufferList(audioModel.getApiSounds().concat())
        },
        error: () => {},
      })
      .then()
  }, [])

  const onClickButton = async () => {
    // await audioModel.play('sample')
    // const buffer = audioModel.getBuffer(audioName)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onClickButton}>
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
      </header>
      <StyledMain>
        <ul className="audio-list">
          {audioBufferList &&
            audioBufferList.map((_audio) => (
              <li key={_audio.name} className="audio-list-item">
                <span className="audio-list-name">{_audio.name}</span>
                <span className="audio-frequency">
                  <AudioFrequencyAtom
                    plotData={AudioFrequencyHelper.convertPlotData(
                      _audio.buffer,
                    )}
                  />
                </span>
              </li>
            ))}
        </ul>
      </StyledMain>
    </div>
  )
}

export default App

const StyledMain = styled.div`
  height: 500px;

  > .audio-list {
    min-width: 100px;
    height: 100%;

    > .audio-list-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;

      min-height: 50px;
      > .audio-list-name {
        font-weight: bold;
        min-width: 100px;
      }

      > .audio-frequency {
        min-height: 50px;
        min-width: 800px;
        height: 50px;
      }
    }
  }
`
