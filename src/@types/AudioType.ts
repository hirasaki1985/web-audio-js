/**
 * track
 */
export interface Track {
  name: string
  buffer: AudioBuffer | null
}

export interface TrackState {
  width: number
  mute: boolean
  volume: number
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
  getAudioNode(): AudioNode
  connect(node: AudioNode): AudioNode
  viewEffector(): JSX.Element
  getViewParameter(): VP
}

export interface AudioViewEffectorBaseRefProps {}

/**
 * mixer
 */
export interface AudioMixer {}

export interface AudioMixerChain {
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
