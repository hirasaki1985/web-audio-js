import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioModel from './models/AudioModel'
import AudioFrequencyAtom from './components/atoms/AudioFrequencyAtom'

function App() {
  const [audioModel, setAudioModel] = useState(new AudioModel())
  const [sampleBuffer, setSampleBuffer] = useState<Uint8Array>()

  useEffect(() => {
    audioModel.loadAudio('/audios/BabyElephantWalk60.wav', 'sample')
  }, [])

  const onClickButton = async () => {
    // await audioModel.play('sample')
    await viewAnalyser()
  }

  const viewAnalyser = async () => {
    const analyser = audioModel.getAnalyser()

    /**
     * 振り幅1で考えると、
     * 1 = 255,
     * 0(無音) = 128,
     * -1 = 0
     */
    let isEnd = true
    const times: Uint8Array[] = []
    do {
      const time = new Uint8Array(analyser.fftSize)
      analyser.getByteTimeDomainData(time)
      console.log(time)

      times.push(time)

      isEnd = false
    } while (isEnd)
    setSampleBuffer(
      Array.from(times).reduce((pre, current) => {
        const mergedArray = new Uint8Array(pre.length + current.length)
        mergedArray.set(pre)
        mergedArray.set(current, pre.length)

        return mergedArray
      }),
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onClickButton}>
          再生
        </button>
      </header>
      <StyledMain>
        <AudioFrequencyAtom audioBuffer={sampleBuffer} />
      </StyledMain>
    </div>
  )
}

export default App

const StyledMain = styled.div`
  height: 500px;
`
