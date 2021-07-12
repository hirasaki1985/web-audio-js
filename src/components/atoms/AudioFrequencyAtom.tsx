import React, { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export interface AudioFrequencyAtomProps {
  plotData: frequencyData[]
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
  const { plotData } = props

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={plotData}>
        <Line
          type="monotone"
          dataKey="frequency"
          stroke="#8884d8"
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default AudioFrequencyAtom
