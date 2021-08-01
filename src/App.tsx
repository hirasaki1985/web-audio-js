import React from 'react'
import './App.css'
import AudioController from './cores/AudioController'
import MixerController from './cores/MixerController'
import WevAudioMixer from './pages/WavAudioMixer'

/**
 * controllers
 */
const audioController = new AudioController()
const master = audioController.effectorFactory.getMasterEffector()
const mixerController = new MixerController(master)

/**
 * App
 */
function App() {
  return (
    <WevAudioMixer
      audioController={audioController}
      mixerController={mixerController}
      master={master}
    />
  )
}

export default App
