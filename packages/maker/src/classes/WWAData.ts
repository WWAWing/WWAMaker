import WWAConsts from "./WWAConsts";
import { WWAData } from "@wwawing/common-interface";

// ここから先は WWA Wing の wwa_data.ts から取得したもの
// 詳細は https://github.com/WWAWing/WWAWing/wiki/WWAData を参照のこと

export enum ItemMode {
    NORMAL = 0,
    CAN_USE = 1,
    NOT_DISAPPEAR = 2
}

export enum PartsType {
    MAP = 1,
    OBJECT = 0
}

export enum MoveType {
    STATIC = 0,
    CHASE_PLAYER = 1,
    RUN_OUT = 2,
    HANG_AROUND = 3
}

export enum SystemMessage1 {
    ASK_LINK = 5,
    NO_MONEY = 6,
    NO_ITEM = 7,
    USE_ITEM = 8
}

export enum SystemMessage2 {
    CLICKABLE_ITEM = 0,
    FULL_ITEM = 1,
    LOAD_SE = 2
}

// ここまで WWA Wing の wwa_data.ts と一緒
// ここからは WWA Maker 独自

export const defaultWWAData: WWAData = {
    version: WWAConsts.CURRENT_VERSION,

    gameoverX: 0,
    gameoverY: 0,

    playerX: 0,
    playerY: 0,

    mapPartsMax: 100,
    objPartsMax: 100,

    isOldMap: false,

    statusEnergyMax: 0,
    statusEnergy: 0,
    statusStrength: 0,
    statusDefence: 0,
    statusGold: 0,

    itemBox: [],

    mapWidth: WWAConsts.MAP_SIZE_DEFAULT,
    messageNum: 0,

    map: createEmptyMap(WWAConsts.MAP_SIZE_DEFAULT),
    mapObject: createEmptyMap(WWAConsts.MAP_SIZE_DEFAULT),

    mapCompressed: [],
    mapObjectCompressed: [],

    mapAttribute: [],
    objectAttribute: [],

    worldPassword: '',
    message: [],
    worldName: '',
    worldPassNumber: 0,
    charCGName: '',
    mapCGName: '',
    systemMessage: [],
    moves: 0,

    yesnoImgPosX: 3,
    yesnoImgPosY: 4,
    playerImgPosX: 2,
    playerImgPosY: 0,
    clickableItemSignImgPosX: 0,
    clickableItemSignImgPosY: 0,

    disableSaveFlag: false,
    compatibleForOldMapFlag: false,
    objectNoCollapseDefaultFlag: false,

    delPlayerFlag: false,

    bgm: 0,
    effectCoords: [],
    effectWaits: 0,

    imgClickX: 0,
    imgClickY: 0,

    frameColorR: 0,
    frameColorG: 0,
    frameColorB: 0,

    frameOutColorR: 0,
    frameOutColorG: 0,
    frameOutColorB: 0,

    fontColorR: 0,
    fontColorG: 0,
    fontColorB: 0,

    statusColorR: 0,
    statusColorG: 0,
    statusColorB: 0,
    checkOriginalMapString: '',
    checkString: '',
    
    isItemEffectEnabled: false,

    gamePadButtonItemTable: []
}

/**
 * 空の2次元配列を作成します。WWAData.map の初期化に利用します。
 * @param size 
 * @return 
 */
function createEmptyMap(size: number): number[][] {
    return new Array<Array<number>>(size).fill(
        new Array<number>(size).fill(0)
    );
}

export type SystemMessageType = SystemMessage1 | SystemMessage2;

export type PartsAttributes = WWAData["mapAttribute"] | WWAData["objectAttribute"];
export type PartsAttributeItems = PartsAttributes[number];

/**
 * 空のパーツ属性配列を作成します。
 */
export function createEmptyPartsAttribute(type: PartsType): number[] {
    switch (type) {
        case PartsType.OBJECT:
            return new Array<number>(WWAConsts.OBJ_ATR_MAX).fill(0);
        case PartsType.MAP:
            return new Array<number>(WWAConsts.MAP_ATR_MAX).fill(0);
    }
}

export enum ObjectPartsType {
    
}

export enum MapPartsType {

}
