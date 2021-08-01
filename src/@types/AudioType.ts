/**
 * track
 */
import MasterEffector from '../effectors/master/MasterEffector'

export interface Track {
  name: string
  viewName: string
  buffer: AudioBuffer | null
}

export interface TrackState {
  width: number // 波形の長sだ
  mute: boolean // ミュート中かどうか
  isPlay: boolean // 再生中かどうか
  volume: number // 音量
}

export interface TrackListItem {
  track: Track
  state: TrackState
}

/**
 * effector
 */
export interface AudioEffector<VP> {
  name: string
  viewName: string
  getAudioNode(): AudioNode
  connect(node: AudioNode): AudioNode
  viewEffector(): JSX.Element
  getViewParameter(): VP
}

export interface AudioViewEffectorBaseRefProps {}

/**
 * mixer
 */
export interface AudioMixer {
  chains: AudioMixerChain[]
  master: MasterEffector
}

export interface AudioMixerChain {
  track: TrackListItem
  effectors: AudioEffector<AudioViewEffectorBaseRefProps>[]
}

/**
 * master
 */
export interface AudioMasterParams {}

/**
 * state
 */
export interface AudioCurrentState {
  // 再生開始位置
  timePosition: number
  // 現在選択している位置(縦線の位置)
  outputPosition: ObjectPosition
}

/**
 * view: track
 */
export interface TrackListViewParam {
  frequencyHeight: number
  frequencyItemWidth: number
  frequencyLeftMargin: string
  secondPixel: number
  magnification: number
}

export interface TrackListItemViewParam {
  nameWidth: number
  namePadding: string
  maxFrequencyWidth: number
}

/**
 * position
 */
export interface ObjectPosition {
  x: number
  y: number
  width?: number
  height?: number
}
