import React, { useMemo } from 'react'
import styled from 'styled-components'
import MathUtil from '../../Utils/MathUtil'
import { TrackListViewParam } from '../../@types/AudioType'

/**
 * types
 */
export interface AudioFrequencyMemoryProps {
  audioViewParam: TrackListViewParam
  nameWidth: number
  maxFrequencyWidth: number
  magnification: number
  secondPixel: number
}

interface RulerMemory {
  name: string
  value: number
}

const AudioFrequencyMemoryAtom: React.FC<AudioFrequencyMemoryProps> = (
  props: AudioFrequencyMemoryProps,
) => {
  const {
    audioViewParam,
    nameWidth,
    maxFrequencyWidth,
    magnification,
    secondPixel,
  } = props

  /**
   * メモリーを作成
   */
  const memories = useMemo<RulerMemory[]>(() => {
    // 1メモリーのピクセル数を取得
    const oneMemoryWidth = magnification * secondPixel

    // 中間メモリの値一覧取得
    const middleMemoryNum = Math.floor(maxFrequencyWidth / oneMemoryWidth)

    const result: RulerMemory[] = [...Array(middleMemoryNum + 1)].map(
      (_, i) => ({
        name: `${i}s`,
        value: i * oneMemoryWidth,
      }),
    )
    const maxWidthNum = MathUtil.mathRound(maxFrequencyWidth, 2)

    result.push({
      name: `${MathUtil.mathRound(maxWidthNum / oneMemoryWidth, 2)}s`,
      value: maxWidthNum,
    })

    return result
  }, [maxFrequencyWidth, magnification, secondPixel])

  return (
    <StyleContainer
      nameWidth={nameWidth}
      frequencyWidth={maxFrequencyWidth}
      frequencyLeftMargin={audioViewParam.frequencyLeftMargin}
    >
      <div className="audio-list-name" />
      <div className="audio-ruler">
        {memories.map((_memory) => (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${_memory.value}px`,
            }}
            key={_memory.value}
          >
            {_memory.name}
          </div>
        ))}
      </div>
    </StyleContainer>
  )
}

interface StyleContainerProps {
  nameWidth: number
  frequencyWidth: number
  frequencyLeftMargin: string
}

const StyleContainer = styled.li<StyleContainerProps>`
  // ruler
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;

  > .audio-list-name {
    width: ${(props) => props.nameWidth}px;
    min-width: ${(props) => props.nameWidth}px;
  }

  > .audio-ruler {
    margin-left: ${(props) => props.frequencyLeftMargin};
    width: ${(props) => props.frequencyWidth}px;
    min-width: ${(props) => props.frequencyWidth}px;
    border-top: black 1px solid;
    position: relative;
  }
`

export default AudioFrequencyMemoryAtom
