import WWAConsts from "../classes/WWAConsts";

/**
 * 座標をマス単位の値に変換します。
 * @return マス単位の値に変換したX座標とY座標の配列
 */
export default function getPosEachChip(x: number, y: number): [number, number] {
    return [Math.floor(x / WWAConsts.CHIP_SIZE), Math.floor(y / WWAConsts.CHIP_SIZE)];
}
