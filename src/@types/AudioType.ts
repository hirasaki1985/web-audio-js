/**
 * sound
 */
export interface ApiSound {
  name: string
  buffer: AudioBuffer | null
}

export interface AudioBufferList {
  width: number
  apiSound: ApiSound
}

/**
 * effector
 */
export interface AudioEffector<VP> {
  name: string
  getAudioNode(): AudioNode
  viewEffector(): JSX.Element
  getViewParameter(): VP
}

export interface AudioViewEffectorBaseRefProps {}

/**
 * mixer
 */
export interface AudioMixer {}

export interface AudioMixerChain {}

/**
 *
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
 * view: audio list
 */
export interface AudioListViewParam {
  frequencyHeight: number
  frequencyItemWidth: number
  frequencyLeftMargin: string
  secondPixel: number
  magnification: number
}

export interface AudioListItemParam {
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
