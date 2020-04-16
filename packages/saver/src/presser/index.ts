import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";
import WWADataArray from "./WWADataArray";
import getMapWidth from "./getMapWidth";

/**
 * WWAData から 8ビット配列 に変換します。
 * @param wwaData 
 */
export default function press(wwaData: WWAData): Uint8ClampedArray {
    let array = new WWADataArray();

    array.set2ByteNumber(WWAConsts.DATA_VERSION, wwaData.version);
    array.set2ByteNumber(WWAConsts.DATA_STATUS_ENERGYMAX, wwaData.statusEnergyMax);
    array.set2ByteNumber(WWAConsts.DATA_STATUS_ENERGY, wwaData.statusEnergy);
    array.set2ByteNumber(WWAConsts.DATA_STATUS_STRENGTH, wwaData.statusStrength);
    array.set2ByteNumber(WWAConsts.DATA_STATUS_DEFENCE, wwaData.statusDefence);
    array.set2ByteNumber(WWAConsts.DATA_STATUS_GOLD, wwaData.statusGold);
    array.set2ByteNumber(WWAConsts.DATA_CHARA_X, wwaData.playerX);
    array.set2ByteNumber(WWAConsts.DATA_CHARA_Y, wwaData.playerY);
    array.set2ByteNumber(WWAConsts.DATA_OVER_X, wwaData.gameoverX);
    array.set2ByteNumber(WWAConsts.DATA_OVER_Y, wwaData.gameoverY);
    // WWAマップ作成ツールのソースコードでは、所持アイテムの情報を含ませていましたが、 3.x では未使用のため、ここでは使用しません。
    array.set2ByteNumber(WWAConsts.DATA_MAP_SIZE, getMapWidth(wwaData.map, wwaData.mapObject));

    // TODO: WWAマップ作成ツールのソースコードから順次データを埋める処理を作る

    return array.getArray();
}
