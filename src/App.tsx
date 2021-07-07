import React, { useEffect, useState } from 'react'
import './App.css'
import AudioModel from './models/AudioModel'

function App() {
  const [audioModel, setAudioModel] = useState(new AudioModel())

  useEffect(() => {
    audioModel.loadAudio('/audios/BabyElephantWalk60.wav', 'sample')
  }, [])

  const onClickButton = async () => {
    await audioModel.play('sample')
  }

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onClickButton}>
          再生
        </button>
      </header>
    </div>
  )
}

export default App
