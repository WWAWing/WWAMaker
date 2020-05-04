/**
 * 左から X座標, Y座標, 横幅, 縦幅
 */
type RectType = [number, number, number, number];

/**
 * 2つの点から始点とサイズを求めます。
 *     主に矩形選択時の描画範囲指定に使用します。
 *     サイズは終端を含めた値になります。
 * @param primaryX
 * @param primaryY
 * @param secondaryX
 * @param secondaryY
 * @returns RectType を参照のこと。
 */
export default function getRect(primaryX: number, primaryY: number, secondaryX?: number, secondaryY?: number): RectType {
    if (secondaryX === undefined || secondaryY === undefined) {
        return [primaryX, primaryY, 1, 1];
    }

    const x = Math.min(primaryX, secondaryX);
    const y = Math.min(primaryY, secondaryY);
    const width = Math.abs(primaryX - secondaryX) + 1;
    const height = Math.abs(primaryY - secondaryY) + 1;

    return [x, y, width, height];
}
