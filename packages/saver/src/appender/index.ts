import { WWAData } from "@wwawing/common-interface";
import WWADataArray from "../utils/WWADataArray";

/**
 * 8ビット配列に文字列データを付与します。
 * @param array 付与される8ビット配列
 * @param wwaData WWAデータ
 */
export default function append(array: WWADataArray, wwaData: WWAData) {

    if (wwaData.worldPassNumber !== 0) {
        const passwordNumber = ((wwaData.worldPassNumber + 2357) * 17 + 1197) * 10 + (wwaData.worldPassNumber % 9);
        array.setString(passwordNumber.toString());
    } else {
        // TODO: \0 を JavaScript ではどう表現するのか確かめる
        array.setString("");
    }

    wwaData.message.forEach(message => {
        array.setString(message);
    });

    array.setString(wwaData.worldName);
    array.setString("");
    array.setString(wwaData.charCGName); // BMP画像
    array.setString(wwaData.mapCGName); // GIF画像

    wwaData.systemMessage.forEach(message => {
        array.setString(message);
    });

    return array;
}
