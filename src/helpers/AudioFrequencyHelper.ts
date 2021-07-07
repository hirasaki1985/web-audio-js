export default class AudioFrequencyHelper {
  public static normalizationY(
    buffer: Uint8Array,
    height: number = 1,
  ): Uint8Array {
    return buffer.map((_item) => (1 - _item / 255) * height)
  }
}
