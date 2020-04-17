/**
 * @todo 近いうちに common-interface にまとめておく
 */
export class WWAConsts {
    static MAP_ATR_MAX: number = 60;
    static OBJ_ATR_MAX: number = 60;
    static ATR_0: number = 0;
    static ATR_STRING: number = 5;
    static MAP_SIZE_DEFAULT: number = 101;
    static MAP_SIZE_INCREASE_UNIT: number = 100;

    // ここからは作成ツールから引っ張った定数一覧です。
    static DATA_CHECK: number = 0;
    static DATA_VERSION: number = 2;
    static DATA_STATUS_ENERGY: number = 10;
    static DATA_STATUS_STRENGTH: number = 12;
    static DATA_STATUS_DEFENCE: number = 14;
    static DATA_STATUS_GOLD: number = 16;
    static DATA_ITEM: number = 20;
    static DATA_STATUS_ENERGYMAX: number = 32;
    static DATA_MAP_COUNT: number = 34;
    static DATA_OBJECT_COUNT: number = 36;
    static DATA_CHARA_X: number = 38;
    static DATA_CHARA_Y: number = 40;
    static DATA_OVER_X: number = 42;
    static DATA_OVER_Y: number = 44;
    static DATA_MAP_SIZE: number = 46;
    static DATA_MES_NUMBER: number = 48;

    static MAP_SIZE_MAX: number = 1001;
    static PARTS_NUMBER_MAX: number = 4000;
    // マップ＋パーツ＋メッセージ領域
    static FILE_DATA_MAX: number = (4000 + 1000 + 1000) * 1024;

    // 作成ツールのソースコードには無い、データ場所の定数一覧です。
    static DATA_MAP: number = 90;
}
