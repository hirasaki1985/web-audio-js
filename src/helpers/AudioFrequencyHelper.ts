import { frequencyData } from '../components/atoms/AudioFrequencyAtom'

export default class AudioFrequencyHelper {
  public static convertPlotData(
    buffer?: AudioBuffer | null,
    channel: number = 0,
    tMin: number = 0,
    tMax: number = 4000,
  ): frequencyData[] {
    // validate
    if (buffer == null) return []

    const { sampleRate } = buffer
    const audioData = buffer.getChannelData(channel)
    const dt = 1 / sampleRate // x軸刻み幅
    const tmp: frequencyData[] = [] // プロットデータ配列

    console.log('audioData', audioData)
    console.log('sampleRate', sampleRate)
    audioData.forEach((_audio, i) => {
      const t = dt * i * 1000 // 現在時刻 [ms]
      if (t < tMin) return // 描画範囲外のデータは無視
      if (t > tMax) return // 描画範囲外のデータは無視

      tmp.push({
        time: t,
        frequency: audioData[i],
      }) // 時系列プロット（時刻 [ms], 変位）
    })
    return tmp
  }

  public static normalizationY(
    buffer: Float32Array,
    height: number = 1,
  ): Float32Array {
    return buffer.map((_item) => (1 - _item / 255) * height)
  }
}
