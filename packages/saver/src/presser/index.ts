import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";
import WWADataArray from "../utils/WWADataArray";

/**
 * WWAData から 8ビット配列 に変換します。
 *     Q: なんで press と言うの？
 *     A: WWAマップ作成ツールのソースコードでは、8ビット配列の変数名が PressData だったので
 */
export default function press(wwaData: WWAData): WWADataArray {
    let array = new WWADataArray(WWAConsts.DATA_MAP);

    array.set2ByteNumber(wwaData.version, WWAConsts.DATA_VERSION);
    array.set2ByteNumber(wwaData.statusEnergyMax, WWAConsts.DATA_STATUS_ENERGYMAX);
    array.set2ByteNumber(wwaData.statusEnergy, WWAConsts.DATA_STATUS_ENERGY);
    array.set2ByteNumber(wwaData.statusStrength, WWAConsts.DATA_STATUS_STRENGTH);
    array.set2ByteNumber(wwaData.statusDefence, WWAConsts.DATA_STATUS_DEFENCE);
    array.set2ByteNumber(wwaData.statusGold, WWAConsts.DATA_STATUS_GOLD);
    array.set2ByteNumber(wwaData.playerX, WWAConsts.DATA_CHARA_X);
    array.set2ByteNumber(wwaData.playerY, WWAConsts.DATA_CHARA_Y);
    array.set2ByteNumber(wwaData.gameoverX, WWAConsts.DATA_OVER_X);
    array.set2ByteNumber(wwaData.gameoverY, WWAConsts.DATA_OVER_Y);
    // WWAマップ作成ツールのソースコードでは、所持アイテムの情報を含ませていましたが、 3.x では未使用のため、ここでは使用しません。
    // WWAマップ作成ツールのソースコードでは、マップサイズの圧縮処理を含ませていましたが、ここでは cleaner 内で処理を済ませています。
    array.set2ByteNumber(wwaData.mapWidth, WWAConsts.DATA_MAP_SIZE);

    // マップについては配置しているパーツ番号をそのまま8ビット空間上に配置します。
    array.setCurrentIndex(WWAConsts.DATA_MAP);
    function setPartsNumberOnMap(mapLine: number[]) {
        mapLine.forEach(mapPartsNumber => {
            array.set2ByteNumber(mapPartsNumber);
        });
    }
    wwaData.map.forEach(setPartsNumberOnMap);
    wwaData.mapObject.forEach(setPartsNumberOnMap);

    // setPartsAttributes は setPartsNumberOnMap と処理内容は同じですが、変数名を分かりやすくするため別々に用意しています。
    function setPartsAttributes(partsAttribute: number[]) {
        partsAttribute.forEach(attributeValue => {
            array.set2ByteNumber(attributeValue);
        });
    }
    wwaData.mapAttribute.forEach(setPartsAttributes);
    wwaData.objectAttribute.forEach(setPartsAttributes);

    array.set2ByteNumber(wwaData.messageNum, WWAConsts.DATA_MES_NUMBER);
    array.set2ByteNumber(array.getCheckData(WWAConsts.DATA_VERSION), WWAConsts.DATA_CHECK);

    return array;
}
