import WWAData, { defaultWWAData } from '../classes/WWAData';
import { LoaderProgress, LoaderError, LoaderResponse, LoadState, LoadStage } from '../classes/Loader';
import { MakerError } from '../classes/MakerSystem';
import { ActionCreator, Action } from 'redux';
import { defaultPartsState, PartsState, PartsAction, PartsReducer } from '../parts/PartsStates';

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

// ここに集める
type WWADataActions = MapDataActions & ImageActions & PartsAction;

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
 *     parts: parts/PartsState を参照
 */
interface MapDataState {
    loadState: LoadState,
    progress: LoaderProgress,
    error: MakerError,
    wwaData: WWAData,
    image: CanvasImageSource,
    parts: PartsState
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
    image: new Image(),
    parts: defaultPartsState
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
        default: {
            /**
             * パーツの場合はしばらくはここで対応します。
             */
            const newState = Object.assign({}, state);
            newState.parts = PartsReducer(state.parts, action);

            return newState;
        }
    }
}
