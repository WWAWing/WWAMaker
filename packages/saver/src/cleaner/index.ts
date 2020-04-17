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
    /**
     * lastItemIndex は最後のメッセージデータのインデックスで、計算を終えるとそのインデックス以降のメッセージデータは削除されます。
     */
    let lastItemIndex = 0;
    newWWAData.message = wwaData.message.map((message, messageIndex) => {
        if (objectMessageIndex.includes(messageIndex) || mapMessageIndex.includes(messageIndex)) {
            lastItemIndex = messageIndex;
            return message;
        }
        return "";
    });

    newWWAData.message.splice(lastItemIndex + 1);
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


    return newWWAData;
}
