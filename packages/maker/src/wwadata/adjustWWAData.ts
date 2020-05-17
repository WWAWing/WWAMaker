import { WWAData } from "@wwawing/common-interface";
import getPartsCountPerIncreaseUnit from "../common/getPartsCountPerIncreaseUnit";
import { PartsAttributes, createEmptyPartsAttribute, PartsType } from "../classes/WWAData";

/**
 * WWA Loader で取得した WWAData を WWA Maker 向けに最適化します。
 * @todo 近いうちに WWA Loader と統合する
 */
export default function adjustWWAData(wwaData: WWAData): WWAData {
    const newWWAData = Object.assign({}, wwaData);

    const objectPartsCount = getPartsCountPerIncreaseUnit(newWWAData.objPartsMax);
    newWWAData.objPartsMax = objectPartsCount;
    newWWAData.objectAttribute = getPartsAttributes(newWWAData.objectAttribute, objectPartsCount, PartsType.OBJECT);

    const mapPartsCount = getPartsCountPerIncreaseUnit(newWWAData.mapPartsMax);
    newWWAData.mapPartsMax = mapPartsCount;
    newWWAData.mapAttribute = getPartsAttributes(newWWAData.mapAttribute, mapPartsCount, PartsType.MAP);

    return newWWAData;
}

/**
 * パーツの属性を空部分を補填した形で取得します。
 * @param attributes 対象の属性
 * @param count 補填する最大数
 * @param type パーツ種類
 */
function getPartsAttributes(attributes: PartsAttributes, count: number, type: PartsType): PartsAttributes {
    let emptyAttributes = [];

    for (let index = attributes.length; index < count; index++) {
        emptyAttributes.push(createEmptyPartsAttribute(type));
    }
    return attributes.concat(emptyAttributes);
}
