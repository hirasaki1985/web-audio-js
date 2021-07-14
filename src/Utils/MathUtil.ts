export default class MathUtil {
  public static mathRound = (num: number, decimalPoint: number = 2): number =>
    Math.round(num * 10 ** decimalPoint) / 10 ** decimalPoint
}
