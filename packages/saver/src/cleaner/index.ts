import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";
import getMapWidth from "./getMapWidth";
import getPartsCount from "./getPartsCount";

/**
 * WWAData から不要な情報を取り除き最適化します。
 * @param wwaData 
 */
export default function clean(wwaData: WWAData): WWAData {

    const newWWAData = Object.assign({}, wwaData);

    /**
     * 1. 使用されていないメッセージを削除します。
     */
    const objectMessageIndex = wwaData.objectAttribute.map((attribute) => attribute[WWAConsts.ATR_STRING]);
    const mapMessageIndex = wwaData.mapAttribute.map((attribute) => attribute[WWAConsts.ATR_STRING]);

    let newMessageIndex = 0;
    /**
     * 使用されていないメッセージを filter メソッドで消去します。
     *     消去した分、メッセージのインデックスがシフトされるため、参照元のパーツ属性には新しいメッセージのインデックスを付与します。
     */
    newWWAData.message = wwaData.message.filter((message, messageIndex) => {
        // 2.x 以前で使用していたシステムメッセージの領域を確保
        if (messageIndex < WWAConsts.MESSAGE_FIRST_CHARA) {
            newMessageIndex++;
            return true;
        }

        const usedObjectPartsNumber = objectMessageIndex.findIndex(index => index === messageIndex);
        if (usedObjectPartsNumber !== -1) {
            newWWAData.objectAttribute[usedObjectPartsNumber][WWAConsts.ATR_STRING] = newMessageIndex;
        }

        const usedMapPartsNumber = mapMessageIndex.findIndex(index => index === messageIndex);
        if (usedMapPartsNumber !== -1) {
            newWWAData.mapAttribute[usedMapPartsNumber][WWAConsts.ATR_STRING] = newMessageIndex;
        }

        if (usedObjectPartsNumber !== -1 || usedMapPartsNumber !== -1) {
            newMessageIndex++;
            return true;
        }

        return false;
    });

    newWWAData.messageNum = newWWAData.message.length;


    /**
     * 2. マップの幅を最適化します。
     */
    const newMapWidth = getMapWidth(wwaData.map, wwaData.mapObject);
    newWWAData.mapWidth = newMapWidth;

    function removeMapPartsOutside(map: number[][], mapWidth: number) {
        map.splice(mapWidth + 1);
        map.forEach(line => line.splice(mapWidth + 1));
    }
    removeMapPartsOutside(newWWAData.map, newMapWidth);
    removeMapPartsOutside(newWWAData.mapObject, newMapWidth);


    /**
     * 3. パーツ属性を最適化します。
     */
    const newMapCount = getPartsCount(wwaData.mapAttribute);
    newWWAData.mapPartsMax = newMapCount;
    const newObjectCount = getPartsCount(wwaData.objectAttribute);
    newWWAData.objPartsMax = newObjectCount;

    function removePartsAttributeOutside(partsAttribute: number[][], partsCount: number) {
        partsAttribute.splice(partsCount);
    }
    removePartsAttributeOutside(newWWAData.mapAttribute, newMapCount);
    removePartsAttributeOutside(newWWAData.objectAttribute, newObjectCount);


    return newWWAData;
}
