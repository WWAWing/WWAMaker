import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { loadWWADataPromise, encodeImagePromise, loadImagePromise } from "./LoadPromises";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { setMapdata, setImage, closeMapdata } from "../State";
import { Progress, LoaderError } from "@wwawing/loader";

/**
 * Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @see MapData
 */
export interface LoadState {
    progress: Progress|null,
    error: LoaderError|null
}

/**
 * 読み込み操作を行う際に指定が必要な interface です。
 */
interface LoadWWADataState {
    mapdataFileName: string
}

/**
 * 画像読み込み操作を行う際に指定が必要な interface です。
 */
interface LoadImageState {
    imagePath: string
}

const actionCreator = actionCreatorFactory();
const actionCreatorAsync = asyncFactory<LoadWWADataState>(actionCreator);


/**
 * マップデータ読み込みを行うアクションです。
 */
export const loadMapdata = actionCreatorAsync<LoadWWADataState, void, LoaderError>(
    'LOAD_MAPDATA',
    async (params, dispatch) => {
        // マップデータを閉じる
        dispatch(closeMapdata());

        // マップデータの読み込み
        const wwaData = await loadWWADataPromise(
            params.mapdataFileName,
            progress => {
                dispatch(setLoadingProgress(progress));
            }
        );
        dispatch(setMapdata({ wwaData: wwaData }));

        // イメージ画像の読み込み
        const imageData = await loadImagePromise(wwaData.mapCGName);
        const imageUrl = await encodeImagePromise(imageData);
        dispatch(setImage({ imageUrl }));
    }
);

/**
 * イメージを読み込むアクションです。
 *     基本設定の編集のような、画像だけの再読み込みを必要とする場合に使用します。
 */
export const loadImage = actionCreatorAsync<LoadImageState, void, LoaderError>(
    'LOAD_IMAGE',
    async (params, dispatch) => {
        // イメージ画像の読み込み
        const imageData = await loadImagePromise(params.imagePath);
        const imageUrl = await encodeImagePromise(imageData);
        dispatch(setImage({ imageUrl }));
    }
);

/**
 * ローディング状態を記録します。
 *     typescript-fsa-redux-thunk では、 開始→エラー/完了 しかアクションを起こすことができません。
 *     このメソッドは、その「開始」と「エラー/完了」の間で発生する途中経過に対応したアクションになります。
 */
const setLoadingProgress = actionCreator<Progress>("SET_LOADING_PROGRESS");

export const INITIAL_STATE: LoadState = {
    progress: null,
    error: null
};

export const LoadReducer = reducerWithInitialState(INITIAL_STATE)
    .case(setLoadingProgress, (state, progress) => ({
        ...state,
        progress: progress
    }))
    .case(loadMapdata.async.failed, (state, params) => ({
        ...state,
        error: params.error
    }))
    .case(loadMapdata.async.done, (state) => ({
        ...state,
        progress: null
    }))
    .case(loadImage.async.failed, (state, params) => ({
        ...state,
        error: params.error
    }))
