import React, { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import AudioFrequencyHelper from '../../helpers/AudioFrequencyHelper'

export interface AudioFrequencyAtomProps {
  audioBuffer?: Uint8Array
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export interface frequencyData {
  frequency: number
}

const AudioFrequencyAtom: React.FC<AudioFrequencyAtomProps> = (
  props: AudioFrequencyAtomProps,
) => {
  const { audioBuffer } = props

  const data: frequencyData[] = useMemo(() => {
    if (audioBuffer == null) return []

    const _data = AudioFrequencyHelper.normalizationY(audioBuffer)

    console.log('AudioFrequencyAtom _data', _data)
    return Array.from(_data).map((_item) => ({
      frequency: _item,
    }))
  }, [audioBuffer])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={data}>
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
