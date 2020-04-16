import { WWAData } from "@wwawing/common-interface";
import appendString from "./appendString";

/**
 * 8ビット配列に文字列データを付与します。
 * @param array 付与される8ビット配列
 * @param wwaData WWAデータ
 */
export default function append(array: Uint8ClampedArray, wwaData: WWAData) {

    if (wwaData.worldPassNumber !== 0) {
        const passwordNumber = ((wwaData.worldPassNumber + 2357) * 17 + 1197) * 10 + (wwaData.worldPassNumber % 9);
        appendString(array, passwordNumber.toString());
    } else {
        // TODO: \0 を JavaScript ではどう表現するのか確かめる
        appendString(array, "\0");
    }

    wwaData.message.forEach(message => {
        appendString(array, message);
    });

    appendString(array, wwaData.worldName);
    appendString(array, "");
    appendString(array, wwaData.charCGName); // BMP画像
    appendString(array, wwaData.mapCGName); // GIF画像

    wwaData.systemMessage.forEach(message => {
        appendString(array, message);
    });

    return array;
}
