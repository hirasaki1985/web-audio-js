import { ApiSound } from '../models/AudioModel'

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
  outputPosition: ObjectPosition
}
