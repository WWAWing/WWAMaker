import WWAData, { LoaderProgress, LoaderError, LoaderResponse, LoadState, LoadStage, MakerError } from "../classes/WWAData";
import { ActionCreator, Action } from 'redux';

/**
 * MapData 概略
 *     MapData の読み込みは大きく分けて "マップデータ" と "画像" の分かれるため、
 *     アクションの種類も2種類に分かれています。
 */

type MapDataActionType = 'LOAD_WWADATA' | 'PROGRESS_WWADATA' | 'SET_WWADATA' | 'SAVE_WWADATA' | 'ERROR_WWADATA';

export interface LoadWWADataAction extends Action {
    type: MapDataActionType
    payload: {
        mapdataFileName: string
    }
}

interface ProgressWWADataAction extends Action {
    type: MapDataActionType
    payload: LoaderProgress
}

interface ErrorWWADataAction extends Action {
    type: MapDataActionType
    payload: LoaderError
}

interface SetWWADataAction extends Action {
    type: MapDataActionType
    payload: WWAData
}

type MapDataActions = LoadWWADataAction & ProgressWWADataAction & ErrorWWADataAction & SetWWADataAction;

// ここからイメージ

/**
 * ImageActionType は Redux Saga の ChannelEvent で利用する値の型チェックに利用します。
 */
export type ImageActionType = 'LOAD_IMAGE' | 'ERROR_IMAGE' | 'SET_IMAGE';

export interface LoadImageAction extends Action {
    type: ImageActionType
    payload: {
        mapCGName: string
    }
}

interface ErrorImageAction extends Action {
    type: ImageActionType
    payload: MakerError
}

interface SetImageAction extends Action {
    type: ImageActionType
    payload: CanvasImageSource
}

type ImageActions = LoadImageAction & ErrorImageAction & SetImageAction;
type WWADataActions = MapDataActions & ImageActions;

// ここからアクションクリエイター

export const loadWWAData: ActionCreator<MapDataActions> = (mapdataFileName: string) => ({
    type: 'LOAD_WWADATA',
    payload: {
        mapdataFileName: mapdataFileName
    }
} as MapDataActions);

export const errorWWAData: ActionCreator<MapDataActions> = (response: LoaderResponse) => ({
    type: 'ERROR_WWADATA',
    payload: response.error
} as MapDataActions);

export const progressWWAData: ActionCreator<MapDataActions> = (response: LoaderResponse) => ({
    type: 'PROGRESS_WWADATA',
    payload: response.progress
} as MapDataActions);

export const setWWAData: ActionCreator<MapDataActions> = (response: LoaderResponse) => ({
    type: 'SET_WWADATA',
    payload: response.wwaData
} as MapDataActions);

export const loadImage: ActionCreator<ImageActions> = (mapCGName: string) => ({
    type: 'LOAD_IMAGE',
    payload: {
        mapCGName: mapCGName
    }
} as ImageActions);

export const errorImage: ActionCreator<ImageActions> = (event: ErrorEvent) => ({
    type: 'ERROR_IMAGE',
    payload: {
        title: 'エラー',
        message: event.message
    }
} as ImageActions);

export const setImage: ActionCreator<ImageActions> = (image: CanvasImageSource) => ({
    type: 'SET_IMAGE',
    payload: image
} as ImageActions);

/**
 * ステートの MapData の中身を定義するインターフェイスです。
 *     loadState: 現在の読み込み状況
 *     progress: 読み込み途中の情報
 *     error: エラー情報
 *     image: イメージ
 */
interface MapDataState {
    loadState: LoadState,
    progress: LoaderProgress,
    error: MakerError,
    wwaData: WWAData,
    image: CanvasImageSource
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
 * @todo これらの定数は WWAData.ts か common-interface に移行する予定
 */
const currentVersion = 32;
const defaultMapWidth = 101;
const defaultWWAData: WWAData = {
    version: currentVersion,

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

    mapWidth: defaultMapWidth,
    messageNum: 0,

    map: createEmptyMap(defaultMapWidth),
    mapObject: createEmptyMap(defaultMapWidth),

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
const defaultMapData: MapDataState = {
    loadState: LoadState.LOADING_MAPDATA,
    progress: {
        current: 0,
        stage: LoadStage.INIT,
        total: 0
    },
    error: {
        title: '',
        message: ''
    },
    wwaData: defaultWWAData,
    image: new Image()
}

export function MapDataReducer (state: MapDataState = defaultMapData, action: WWADataActions): MapDataState {
    /**
     * @todo もしかしたら case の値は文字列ではなく、別途 ActionType を作成してその ActionType を利用したほうが良いかもしれない？
     */
    switch (action.type) {
        case 'PROGRESS_WWADATA': {
            const newState = Object.assign({}, state);
            newState.loadState = LoadState.LOADING_MAPDATA;
            newState.progress = action.payload;
            
            return newState;
        }
        case 'ERROR_WWADATA': {
            const newState = Object.assign({}, state);
            newState.loadState = LoadState.ERROR_MAPDATA;
            newState.error = action.payload;

            return newState;
        }
        case 'SET_WWADATA': {
            const newState = Object.assign({}, state);
            newState.loadState = LoadState.LOADING_IMAGE;
            newState.wwaData = action.payload;

            return newState;
        }
        case 'ERROR_IMAGE': {
            const newState = Object.assign({}, state);
            newState.loadState = LoadState.ERROR_IMAGE;
            newState.error = action.payload;

            return newState;
        }
        case 'SET_IMAGE': {
            const newState = Object.assign({}, state);
            newState.loadState = LoadState.DONE;
            newState.image = action.payload;

            return newState;
        }
    }
    return state;
}
