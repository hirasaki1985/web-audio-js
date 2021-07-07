import React from 'react'
import './App.css'

function App() {
  const audioContext = new AudioContext()

  const request = new XMLHttpRequest()
  let audioBuffer: AudioBuffer | null = null
  request.open('GET', '/audios/BabyElephantWalk60.wav', true)
  request.responseType = 'arraybuffer'

  request.onload = async () => {
    await audioContext.decodeAudioData(
      request.response,
      (buffer) => {
        audioBuffer = buffer
      },
      (error) => {
        console.error('decodeAudioData error', error)
      },
    )
  }

  request.send()

  const onClickButton = () => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start(0)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button value="button" onClick={onClickButton}>
          再生
        </button>
      </header>
    </div>
  )
}

export default App
