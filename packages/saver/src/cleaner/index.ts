import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";
import getMapWidth from "./getMapWidth";
import getPartsCount from "./getPartsCount";

/**
 * WWAData から不要な文字列を取り除きます。
 * @param wwaData 
 */
export default function clean(wwaData: WWAData): WWAData {

    const newWWAData = Object.assign({}, wwaData);

    /**
     * 1. 使用されているメッセージのインデックスを取得します。
     */
    let usedMessageIndex: number[] = [];
    usedMessageIndex.concat(wwaData.objectAttribute.map((attribute) => attribute[WWAConsts.ATR_STRING]));
    usedMessageIndex.concat(wwaData.mapAttribute.map((attribute) => attribute[WWAConsts.ATR_STRING]));
    usedMessageIndex.sort();

    /**
     * 2. 用意したメッセージのインデックスから、メッセージの配列を作成します。
     */
    newWWAData.message = usedMessageIndex.map((messageIndex) => wwaData.message[messageIndex]);
    newWWAData.messageNum = usedMessageIndex.length;

    /**
     * 3. マップの幅を最適化します。
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
     * 4. パーツ属性を最適化します。
     */
    const newMapCount = getPartsCount(wwaData.mapAttribute);
    newWWAData.mapPartsMax = newMapCount;
    const newObjectCount = getPartsCount(wwaData.objectAttribute);
    newWWAData.objPartsMax = newObjectCount;

    return newWWAData;
}
