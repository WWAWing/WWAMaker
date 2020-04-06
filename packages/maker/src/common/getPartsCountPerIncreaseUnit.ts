import WWAConsts from "../classes/WWAConsts";

/**
 * 指定したパーツ数をパーツ増減数の単位で収まる値に計算します。
 *     例えばパーツ数が 256 でパーツ増減数の単位が 50 とした場合は、 300 が出力されます。
 * @param partsCount 
 */
export default function getPartsCountPerIncreaseUnit(partsCount: number): number {
    if (partsCount < WWAConsts.PARTS_SIZE_DEFAULT) {
        return WWAConsts.PARTS_SIZE_DEFAULT;
    }
    return Math.ceil(partsCount / WWAConsts.PARTS_SIZE_INCREASE_UNIT) * WWAConsts.PARTS_SIZE_INCREASE_UNIT;
}

