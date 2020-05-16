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

/**
 * 新規作成時のWWAデータです。
 */
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

    mapAttribute: createEmptyPartsAttributes(100, PartsType.MAP),
    objectAttribute: createEmptyPartsAttributes(100, PartsType.OBJECT),

    worldPassword: '',
    message: createEmptyMessages(WWAConsts.MESSAGE_FIRST_CHARA),
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

    imgStatusEnergyX: WWAConsts.IMGPOS_DEFAULT_STATUS_X + WWAConsts.IMGRELPOS_ENERGY_ICON_X,
    imgStatusEnergyY: WWAConsts.IMGPOS_DEFAULT_STATUS_Y,
    imgStatusStrengthX: WWAConsts.IMGPOS_DEFAULT_STATUS_X + WWAConsts.IMGRELPOS_STRENGTH_ICON_X,
    imgStatusStrengthY: WWAConsts.IMGPOS_DEFAULT_STATUS_Y,
    imgStatusDefenceX: WWAConsts.IMGPOS_DEFAULT_STATUS_X + WWAConsts.IMGRELPOS_DEFENCE_ICON_X,
    imgStatusDefenceY: WWAConsts.IMGPOS_DEFAULT_STATUS_Y,
    imgStatusGoldX: WWAConsts.IMGPOS_DEFAULT_STATUS_X + WWAConsts.IMGRELPOS_GOLD_ICON_X,
    imgStatusGoldY: WWAConsts.IMGPOS_DEFAULT_STATUS_Y,
    imgWideCellX: WWAConsts.IMGPOS_DEFAULT_WIDE_CELL_X,
    imgWideCellY: WWAConsts.IMGPOS_DEFAULT_WIDE_CELL_Y,
    imgItemboxX: WWAConsts.IMGPOS_DEFAULT_ITEMBOX_X,
    imgItemboxY: WWAConsts.IMGPOS_DEFAULT_ITEMBOX_Y,
    imgFrameX: WWAConsts.IMGPOS_DEFAULT_FRAME_X,
    imgFrameY: WWAConsts.IMGPOS_DEFAULT_FRAME_Y,
    imgBattleEffectX: WWAConsts.IMGPOS_DEFAULT_BATTLE_EFFECT_X,
    imgBattleEffectY: WWAConsts.IMGPOS_DEFAULT_BATTLE_EFFECT_Y,
    imgClickX: WWAConsts.IMGPOS_DEFAULT_YESNO_X,
    imgClickY: WWAConsts.IMGPOS_DEFAULT_YESNO_Y,

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

    frameCount: 0,

    gamePadButtonItemTable: []
};

/**
 * 空の2次元配列を作成します。WWAData.map の初期化に利用します。
 * @param size 
 * @return 
 */
function createEmptyMap(size: number): number[][] {
    let emptyMap = [];
    for (let y = 0; y < size; y++) {
        let line = [];
        for (let x = 0; x < size; x++) {
            line.push(0);
        }
        emptyMap.push(line);
    }
    return emptyMap;
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

function createEmptyPartsAttributes(count: number, type: PartsType): PartsAttributes {
    return new Array<number[]>(count).fill(createEmptyPartsAttribute(type));
}

function createEmptyMessages(count: number): string[] {
    let emptyString = [];
    for (let index = 0; index < count; index++) {
        emptyString.push("");
    }

    return emptyString;
}
