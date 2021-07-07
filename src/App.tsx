import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel from './models/AudioModel'
import AudioFrequencyAtom from './components/atoms/AudioFrequencyAtom'

function App() {
  const [audioModel, setAudioModel] = useState(new AudioModel())

  useEffect(() => {
    audioModel.loadAudio('/audios/BabyElephantWalk60.wav', 'sample')
  }, [])

  const onClickButton = async () => {
    await audioModel.play('sample')
    await viewAnalyser()
  }

  const viewAnalyser = async () => {
    const analyser = audioModel.getAnalyser()

    const times = new Uint8Array(analyser.fftSize)
    /**
     * 振り幅1で考えると、
     * 1 = 255,
     * 0(無音) = 128,
     * -1 = 0
     */
    analyser.getByteTimeDomainData(times)
    console.log(times)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onClickButton}>
          再生
        </button>
      </header>
      <StyledMain>
        <AudioFrequencyAtom />
      </StyledMain>
    </div>
  )
}

export default App

const StyledMain = styled.div`
  height: 500px;
`
