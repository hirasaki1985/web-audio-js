import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel from './models/AudioModel'
import AudioFrequencyAtom from './components/atoms/AudioFrequencyAtom'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'

function App() {
  const audioName = 'sample'
  const [audioModel, setAudioModel] = useState(new AudioModel())
  const [wavFilePath, setWavFilePath] = useState('/audios/piano.wav')
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>()

  useEffect(() => {
    audioModel.loadAudio(wavFilePath, audioName)
  }, [])

  const onClickButton = async () => {
    // await audioModel.play('sample')
    const buffer = audioModel.getBuffer(audioName)
    setAudioBuffer(buffer)
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
        <AudioFrequencyAtom
          plotData={AudioFrequencyHelper.convertPlotData(audioBuffer)}
        />
      </StyledMain>
    </div>
  )
}

export default App

const StyledMain = styled.div`
  height: 500px;
`
