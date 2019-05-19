export interface Coord {
    x: number;
    y: number;
}

/**
 * @todo 近い内に @wwawing/common-interface と統合する
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

export interface LoaderResponse {
    error: LoaderError|null,
    progress: LoaderProgress|null,
    wwaData: WWAData|null
}

/**
 * 作成ツールで起こりうるエラーを定義するインターフェイスです。
 *     作成ツールの拡張によってこの内容は増えるかもしれないです。
 */
export interface MakerError {
    title: string;
    message: string;
}

export interface LoaderError extends MakerError {}

export interface LoaderProgress {
    current: number;
    total: number;
    stage: LoadStage;
}

export enum LoadStage {
    INIT = 0,
    MAP_LOAD = 1,
    OBJ_LOAD = 2,
    MAP_ATTR = 3,
    OBJ_ATTR = 4,
    RAND_PARTS = 5,
    MESSAGE = 6
}

export enum LoadState {
    EMPTY = 0, // EMPTY は何も開いていない状態を表しますが、もしかしたら利用しないかもしれないです。
    LOADING_MAPDATA = 1,
    LOADING_IMAGE = 2,
    DONE = 3,
    ERROR_MAPDATA = -1,
    ERROR_IMAGE = -2
}

export enum PartsType {
    MAP = 1,
    OBJECT = 0
}
