import React, { useEffect, useState } from 'react'
import {
  AudioCurrentState,
  AudioEffector,
  AudioMixer,
  AudioViewEffectorBaseRefProps,
  ObjectPosition,
  Track,
  TrackListItem,
  TrackListItemViewParam,
  TrackListViewParam,
  TrackState,
} from '../@types/AudioType'
import WavAudioMixerConst from '../consts/AppConst'
import AudioFrequencyHelper from '../helpers/AudioFrequencyHelper'
import AudioListOrganism from '../components/organisms/AudioListOrganism'
import DragAreaOrganism from '../components/organisms/DragAreaOrganism'
import EffectorListOrganism from '../components/organisms/EffectorListOrganism'
import MixerOrganism from '../components/organisms/MixerOrganism'
import styled from 'styled-components'
import AudioController from '../cores/AudioController'
import MixerController from '../cores/MixerController'
import MasterEffector from '../effectors/master/MasterEffector'

/**
 * props
 */
interface WebAudioMixerProps {
  audioController: AudioController
  mixerController: MixerController
  master: MasterEffector
}

const WevAudioMixer: React.FC<WebAudioMixerProps> = (
  props: WebAudioMixerProps,
) => {
  const { audioController, mixerController, master } = props

  /**
   * current
   */
  // track list
  const [trackList, setTrackList] = useState<TrackListItem[]>([])

  // effectors
  const [effectorList, setEffectorList] = useState<
    AudioEffector<AudioViewEffectorBaseRefProps>[]
  >([])

  const [audioMixer, setAudioMixer] = useState<AudioMixer>({
    chains: [],
    master,
  })

  // track view param
  const [trackListViewParam, setTrackListViewParam] =
    useState<TrackListViewParam>({
      frequencyHeight: WavAudioMixerConst.VIEW.FREQUENCY_HEIGHT,
      frequencyItemWidth: WavAudioMixerConst.VIEW.FREQUENCY_ITEM_WIDTH,
      frequencyLeftMargin: WavAudioMixerConst.VIEW.FREQUENCY_LEFT_MARGIN,
      secondPixel: WavAudioMixerConst.VIEW.SECOND_PIXEL,
      magnification: WavAudioMixerConst.VIEW.MAGNIFICATION,
    })

  const [trackListItemViewParam, setTrackListItemViewParam] =
    useState<TrackListItemViewParam>({
      nameWidth: WavAudioMixerConst.VIEW.NAME_WIDTH,
      namePadding: WavAudioMixerConst.VIEW.NAME_CONTAINER_PADDING,
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

  /**
   * getFrequencyWidth
   */
  const getFrequencyWidth = (_duration: number): number =>
    _duration *
    WavAudioMixerConst.VIEW.SECOND_PIXEL *
    WavAudioMixerConst.VIEW.MAGNIFICATION

  /**
   * loadAudioFile
   */
  const loadAudioFile = async (
    _loadAudioFileResource: string | ArrayBuffer,
    _loadAudioFileName: string,
    _loadAudioViewName: string,
  ): Promise<TrackListItem | undefined> => {
    const result: TrackListItem = await new Promise((resolve, reject) => {
      audioController.loadAudio(
        _loadAudioFileResource,
        _loadAudioFileName,
        _loadAudioViewName,
        {
          /**
           * success
           */
          success: (_track: Track) => {
            // create track list item
            const _trackListItem = {
              track: _track,
              state: {
                width: _track.buffer?.duration
                  ? getFrequencyWidth(_track.buffer.duration)
                  : 0,
                mute: false,
                isPlay: false,
                volume: 5,
              },
            }

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
              nameWidth: WavAudioMixerConst.VIEW.NAME_WIDTH,
              namePadding: WavAudioMixerConst.VIEW.NAME_CONTAINER_PADDING,
            })

            resolve(_trackListItem)
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
      // set audio
      const _track1 = await loadAudioFile(
        `/audios/fanfare.wav`,
        'fanfare.wav',
        'ファンファーレ',
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

      if (_track1 == null || _track2 == null) return

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
        master,
      ]

      setEffectorList(_effectors)

      // set mixer
      mixerController.createMixer(_track1, [_effectors[0]])
      mixerController.createMixer(_track2, [_effectors[1]])
      setAudioMixer({
        chains: mixerController.getMixerChains(),
        master,
      })
    }
    initialize()
  }, [])

  /**
   * on click start button
   */
  const onClickStartButton = async () => {
    console.log('WavAudioMixer onClickStartButton()')
    await audioController.playWithMixer(audioMixer, {
      onEnd: () => {
        console.log('on end')
      },
    })

    /* await audioController.playWithEffectors(
      '',
      effectorList[0].getAudioNode(),
      {
        onEnd: () => {
          console.log('on end')
        },
      },
    )
    */
  }

  /**
   * frequency: on mouse click
   */
  const frequencyOnMouseClick = async (_position: ObjectPosition) => {
    console.log('WavAudioMixer frequencyOnMouseClick', _position)
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
    console.log('WavAudioMixer onChangeTrackItemState')
    console.log({
      _track,
      _index,
    })

    const _trackList = trackList.concat()
    _trackList[_index].state = _track.state
    setTrackList(_trackList)
  }

  /**
   * トラックの状態が変更された時
   */
  const onChangeTrackState = (
    _track: Track,
    _state: TrackState,
    _index: number,
  ) => {
    console.log('WavAudioMixer onChangeTrackState')
    console.log({
      _track,
      _state,
      _index,
    })
    const _trackList = trackList.concat()
    _trackList[_index].state = _state
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
          console.log('WavAudioMixer onClickPlay onEnd()')
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
    <StyleContainer className="WavAudioMixer">
      {/* header */}
      <div className="app-header" />

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
            onChangeTrackState={onChangeTrackState}
          />
        </div>

        {/* drag area container */}
        <div className="drag-area-container">
          <DragAreaOrganism onDragFile={onDragFile} />
        </div>
      </div>

      {/* effector list */}
      <div className="effector-list">
        <div>エフェクター</div>
        <div className="effector-list-container">
          <EffectorListOrganism effectors={effectorList} />
        </div>
      </div>

      {/* mixer list */}
      <div className="mixer-list">
        <div>音声出力経路</div>
        <MixerOrganism mixer={audioMixer} onClickMaster={onClickStartButton} />
      </div>
    </StyleContainer>
  )
}

/**
 * style
 */
const StyleContainer = styled.div`
  height: 100%;

  > .app-header {
  }

  // audio list
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

  // effector list
  .effector-list {
    padding: 1em;
    .effector-list-container {
      padding-bottom: 1em;
    }
  }

  // mixer list
  .mixer-list {
    background-color: #ecf3f8;
    padding: 1em;
  }
`

export default WevAudioMixer
