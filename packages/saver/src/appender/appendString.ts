/**
 * 8ビット配列に文字列を付与します。
 * @param targetArray 対象の8ビット配列
 * @param value 付与する値
 * @todo 日本語といったマルチバイト文字については予期しない処理を起こすかもしれないので気を付ける
 */
export default function appendString(targetArray: Uint8ClampedArray, value: string) {
    const valueCodes = value.split("").map((char) => char.charCodeAt(0));
    targetArray.set(valueCodes.concat(0, 0), targetArray.length);
}
