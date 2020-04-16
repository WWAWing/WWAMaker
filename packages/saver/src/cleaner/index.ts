import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";
import getMapWidth from "./getMapWidth";

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
    newWWAData.message = (() => {
        return usedMessageIndex.map((messageIndex) => wwaData.message[messageIndex]);
    })();

    /**
     * 3. マップの幅を最適化します。
     */
    const newMapWidth = getMapWidth(wwaData.map, wwaData.mapObject);
    newWWAData.mapWidth = newMapWidth;

    return newWWAData;
}
