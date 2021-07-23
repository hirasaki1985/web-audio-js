import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import AudioController from './cores/AudioController'
import AudioListOrganism from './components/organisms/AudioListOrganism'
import {
  TrackListItem,
  AudioCurrentState,
  AudioEffector,
  TrackListItemViewParam,
  TrackListViewParam,
  AudioViewEffectorBaseRefProps,
  ObjectPosition,
  Track,
} from './@types/AudioType'
import AudioFrequencyHelper from './helpers/AudioFrequencyHelper'
import DragAreaOrganism from './components/organisms/DragAreaOrganism'
import EffectorListOrganism from './components/organisms/EffectorListOrganism'
import MixerController from './cores/MixerController'
import AppConst from './consts/AppConst'

/**
 * tmp
 */
const firstLoadWav = 'fanfare.wav'
const firstLoadWavViewName = 'ファンファーレ'

/**
 * controllers
 */
const audioController = new AudioController()
const mixerController = new MixerController()

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
      frequencyHeight: AppConst.VIEW.FREQUENCY_HEIGHT,
      frequencyItemWidth: AppConst.VIEW.FREQUENCY_ITEM_WIDTH,
      frequencyLeftMargin: AppConst.VIEW.FREQUENCY_LEFT_MARGIN,
      secondPixel: AppConst.VIEW.SECOND_PIXEL,
      magnification: AppConst.VIEW.MAGNIFICATION,
    })

  const [trackListItemViewParam, setTrackListItemViewParam] =
    useState<TrackListItemViewParam>({
      nameWidth: AppConst.VIEW.NAME_WIDTH,
      namePadding: AppConst.VIEW.NAME_CONTAINER_PADDING,
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
    _duration * AppConst.VIEW.SECOND_PIXEL * AppConst.VIEW.MAGNIFICATION

  /**
   * loadAudioFile
   */
  const loadAudioFile = async (
    _loadAudioFileResource: string | ArrayBuffer,
    _loadAudioFileName: string,
    _loadAudioViewName: string,
  ): Promise<Track | undefined> => {
    const result: Track = await new Promise((resolve, reject) => {
      audioController.loadAudio(
        _loadAudioFileResource,
        _loadAudioFileName,
        _loadAudioViewName,
        {
          /**
           * success
           */
          success: (_track: Track) => {
            // update track list
            setTrackList(
              audioController.getApiSounds().map((_item) => ({
                track: _item,
                state: {
                  width: _item.buffer?.duration
                    ? getFrequencyWidth(_item.buffer.duration)
                    : 0,
                  mute: false,
                  isPlay: false,
                  volume: 5,
                },
              })),
            )

            // audio list item param
            setTrackListItemViewParam({
              maxFrequencyWidth: getFrequencyWidth(
                audioController.getMaxDuration(),
              ),
              nameWidth: AppConst.VIEW.NAME_WIDTH,
              namePadding: AppConst.VIEW.NAME_CONTAINER_PADDING,
            })

            resolve(_track)
          },
          /**
           * error
           */
          error: () => {
            reject()
          },
        },
      )
    })
    return result
  }

  /**
   * initialize
   */
  useEffect(() => {
    const initialize = async () => {
      const _track1 = await loadAudioFile(
        `/audios/${firstLoadWav}`,
        firstLoadWav,
        firstLoadWavViewName,
      )
      console.log('useEffect initialize()')
      console.log({
        _track1,
      })

      const _track2 = await loadAudioFile(
        `/audios/piano.wav`,
        'piano',
        'ピアノ',
      )
      console.log('useEffect initialize()')
      console.log({
        _track2,
      })

      // set effector list
      const _effectors = [
        audioController.effectorFactory.getSimpleDelayEffector(
          'simple delay effector 1',
          'ディレイエフェクター',
        ),
        audioController.effectorFactory.getSimpleReverbEffector(
          'simple reverb effector 1',
          'リバーブエフェクター',
        ),
        audioController.effectorFactory.getMasterEffector(),
      ]
      setEffectorList(_effectors)
    }
    initialize()
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
    await loadAudioFile(_arrayBuffer, _file.name, _file.name)
  }

  /**
   * トラックの状態が変更された時
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

  /**
   * 再生が押された時
   */
  const onClickPlay = async (_track: TrackListItem, _index: number) => {
    const _trackList = trackList.concat()
    _track.state.isPlay = true
    _trackList[_index].state = _track.state
    setTrackList(_trackList)

    await audioController.play(
      _track.track.name,
      {
        onEnd: () => {
          console.log('App onClickPlay onEnd()')
          const _tl = trackList.concat()
          _track.state.isPlay = false
          _tl[_index].state = _track.state
          setTrackList(_tl)
        },
      },
      0,
      audioCurrentState.timePosition,
    )
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
            onClickPlay={onClickPlay}
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
