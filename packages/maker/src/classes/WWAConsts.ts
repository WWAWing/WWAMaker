import { WWAConsts as LoaderWWAConsts } from "@wwawing/loader";

/**
 * WWAの定数一覧です。近い内に common-interface と統合します。
 *     定数の命名規則について
 *     最初に名前、その次に種類や役割を添えます。
 *     例えば、 MAX_SIZE とかにはせず、 SIZE_MAX と、補助的な役割を持つ MAX を後ろに持たせます。
 */
export default class WWAConsts extends LoaderWWAConsts {

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
    static ATR_MOVE: number = 16;
    static ATR_SOUND: number = 19;
    static ATR_APPERANCE_BASE: number = 20;
    static REL_ATR_APPERANCE_ID: number = 0;
    static REL_ATR_APPERANCE_X: number = 1;
    static REL_ATR_APPERANCE_Y: number = 2;
    static REL_ATR_APPERANCE_TYPE: number = 3;
    static REL_ATR_APPERANCE_UNIT_LENGTH: number = 4;

    static ATR_RANDOM_BASE: number = 10;
    static RANDOM_ITERATION_MAX: number = 10;

    static MAP_STREET: number = 0;
    static MAP_WALL: number = 1;
    static MAP_URLGATE: number = 4;

    static OBJECT_NORMAL: number = 0;
    static OBJECT_MESSAGE: number = 1;
    static OBJECT_URLGATE: number = 2;
    static OBJECT_STATUS: number = 3;
    static OBJECT_ITEM: number = 4;
    static OBJECT_DOOR: number = 5;
    static OBJECT_MONSTER: number = 6;
    static OBJECT_SCORE: number = 11;
    static OBJECT_SELL: number = 14;
    static OBJECT_BUY: number = 15;
    static OBJECT_RANDOM: number = 16;
    static OBJECT_SELECT: number = 17;

    static CHIP_SIZE = 40;

    static RELATIVE_COORD_BIAS: number = 10000;
    static RELATIVE_COORD_LOWER: number = WWAConsts.RELATIVE_COORD_BIAS - 1000;
    static PLAYER_COORD: number = WWAConsts.RELATIVE_COORD_BIAS - 1000;

    static PASSABLE_OBJECT: number = 1;

    static APPERANCE_PARTS_MIN_INDEX: number = 0;
    static APPERANCE_PARTS_MAX_INDEX: number = 9;
    static APPERANCE_PARTS_MIN_INDEX_NO: number = 5;
    static APPERANCE_PARTS_MAX_INDEX_YES: number = 4;

    static STATUS_MINUS_BORDER: number = 30000;

    // WWA Wing で定義されていた WWAConsts はここまでになります。
    // ここからは、 WWA Maker 独自で定義する定数になります。

    /**
     * パーツ属性の一番最初のインデックス値です。
     *     普通はこの位置に対応した領域にパーツ番号が記録され、パーツが使用されているか確認することができます。
     *     WWAマップ作成ツールのソースコードから引っ張った定数です。
     */
    static ATR_0 = 0;

    static CURRENT_VERSION = 32;

    static MAP_SIZE_DEFAULT: number = 101;
    static MAP_SIZE_INCREASE_UNIT: number = 100;
    static MAP_SIZE_MAX: number = 1001;

    static PARTS_SIZE_DEFAULT: number = 200;
    static PARTS_SIZE_INCREASE_UNIT: number = 50;
    static PARTS_SIZE_MAX: number = 4000;

    // 相対座標の最大値
    static RELATIVE_COORD_MAX: number = 100;

    static MESSAGE_FIRST_CHARA: number = 10;

    // プレイヤーのそれぞれの向きに対応した相対座標
    static IMGRELPOS_PLAYER_DOWN_X = 2;
}
