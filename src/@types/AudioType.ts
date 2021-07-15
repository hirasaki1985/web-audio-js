export interface ApiSound {
  name: string
  buffer: AudioBuffer | null
}

export interface AudioListViewParam {
  frequencyHeight: number
  frequencyItemWidth: number
  secondPixel: number
  magnification: number
}

export interface AudioListItemParam {
  nameWidth: number
  maxFrequencyWidth: number
}

export interface AudioBufferList {
  width: number
  apiSound: ApiSound
}

export interface ObjectPosition {
  x: number
  y: number
  width?: number
  height?: number
}

export interface AudioCurrentState {
  // 再生開始位置
  timePosition: number
  // 現在選択している位置(縦線の位置)
  outputPosition: ObjectPosition
}
