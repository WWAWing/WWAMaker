/**
 * WWAの定数一覧です。近い内に common-interface と統合します。
 *     定数の命名規則について
 *     最初に名前、その次に種類や役割を添えます。
 *     例えば、 MAX_SIZE とかにはせず、 SIZE_MAX と、補助的な役割を持つ MAX を後ろに持たせます。
 */
export default class WWAConsts {
    static CHIP_SIZE = 40;
    
    static ATR_TYPE: number = 3;
    static ATR_MODE: number = 4;
    static ATR_STRING: number = 5;
    static ATR_X: number = 6;
    static ATR_Y: number = 7;
    static ATR_X2: number = 8;
    static ATR_Y2: number = 9;
    static ATR_ENERGY: number = 10;
    static ATR_STRENGTH: number = 11;
    static ATR_DEFENCE: number = 12;
    static ATR_GOLD: number = 13;
    static ATR_ITEM: number = 14;
    static ATR_NUMBER: number = 15;
    static ATR_JUMP_X: number = 16;
    static ATR_MOVE: number = 16;
    static ATR_JUMP_Y: number = 17;
    static ATR_SOUND: number = 19;
    static ATR_APPERANCE_BASE: number = 20;

    static MAP_SIZE_DEFAULT: number = 101;
    static MAP_SIZE_INCREASE_UNIT: number = 100;
    static MAP_SIZE_MAX: number = 1001;
}
