export default class ArrayUtil {
  public static nonNullable = <T>(value: T): value is NonNullable<T> =>
    value != null
}
