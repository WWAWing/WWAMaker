import WWAConsts from "./WWAConsts";

export interface Coord {
    x: number;
    y: number;
}

/**
 * @todo 近い内に wwawing/common-interface と統合する
 */
export default interface WWAData {
    version: number;

    gameoverX: number;
    gameoverY: number;

    playerX: number;
    playerY: number;

    mapPartsMax: number;
    objPartsMax: number;

    isOldMap: boolean;

    statusEnergyMax: number;
    statusEnergy: number;
    statusStrength: number;
    statusDefence: number;
    statusGold: number;

    itemBox: number[];

    mapWidth: number;
    messageNum: number;

    map: number[][];
    mapObject: number[][];

    mapCompressed: number[][][];
    mapObjectCompressed: number[][][];

    mapAttribute: number[][];
    objectAttribute: number[][];

    worldPassword: string;
    message: string[];
    worldName: string;
    worldPassNumber: number;
    charCGName: string;
    mapCGName: string;
    systemMessage: string[];
    moves: number;

    yesnoImgPosX: number;
    yesnoImgPosY: number;
    playerImgPosX: number;
    playerImgPosY: number;
    clickableItemSignImgPosX: number; // 0の時, 標準枠 注) 面倒なことがわかったので未実装
    clickableItemSignImgPosY: number; // undefined時, 標準枠 注) 面倒なことがわかったので未実装

    disableSaveFlag: boolean;
    compatibleForOldMapFlag: boolean;
    objectNoCollapseDefaultFlag: boolean;

    delPlayerFlag: boolean;

    bgm: number;
    effectCoords: Coord[];
    effectWaits: number;

    imgClickX: number;
    imgClickY: number;

    frameColorR: number;
    frameColorG: number;
    frameColorB: number;

    frameOutColorR: number;
    frameOutColorG: number;
    frameOutColorB: number;

    fontColorR: number;
    fontColorG: number;
    fontColorB: number;

    statusColorR: number;
    statusColorG: number;
    statusColorB: number;
    checkOriginalMapString: string;
    checkString: string;

    isItemEffectEnabled: boolean; 
}

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
    
    isItemEffectEnabled: false
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

/**
 * 空のパーツ属性配列を作成します。
 */
export function createEmptyPartsAttribute(): number[] {
    return new Array<number>(WWAConsts.ATR_MAX).fill(0);
}

export enum PartsType {
    MAP = 1,
    OBJECT = 0
}
