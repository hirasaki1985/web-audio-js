import React, { useMemo } from 'react'
import { LineChart, Line } from 'recharts'
import { ObjectPosition } from '../../@types/AudioType'

export interface AudioFrequencyAtomProps {
  plotData: frequencyData[]
  width?: number
  height?: number
  onMouseMove: (position: ObjectPosition) => void
  onMouseClick: (position: ObjectPosition) => void
}

/**
 * types
 */
export interface frequencyData {
  time: number
  frequency: number
}

const AudioFrequencyAtom: React.FC<AudioFrequencyAtomProps> = (
  props: AudioFrequencyAtomProps,
) => {
  const { plotData, width, height, onMouseMove, onMouseClick } = props

  const viewPlotData = useMemo(() => plotData, [plotData, width])

  return (
    <LineChart
      width={width}
      height={height}
      data={viewPlotData}
      onMouseMove={(e: any) => {
        if (e == null || e.chartX == null || e.chartY == null) return
        onMouseMove({
          x: Number(e.chartX),
          y: Number(e.chartY),
        })
      }}
      onClick={(e: any) => {
        if (e == null || e.chartX == null || e.chartY == null) return
        onMouseClick({
          x: Number(e.chartX),
          y: Number(e.chartY),
        })
      }}
    >
      <Line
        type="monotone"
        dataKey="frequency"
        stroke="#8884d8"
        strokeWidth={1}
        dot={false}
      />
    </LineChart>
  )
}

AudioFrequencyAtom.defaultProps = {
  width: 500,
  height: 300,
}

export default AudioFrequencyAtom
