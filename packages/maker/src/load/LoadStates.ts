import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { LoadStage, LoaderError, LoaderProgress, LoaderResponse } from "./Loader";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import WWAData from "../classes/WWAData";
import { setMapdata, setImage } from "../State";

/**
 * Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @see MapData
 */
export interface LoadState {
    progress: LoadStage|null,
    error: LoaderError|null
}

/**
 * 読み込み操作を行う際に指定が必要な interface です。
 */
interface LoadWWADataState {
    mapdataFileName: string
}

const actionCreator = actionCreatorFactory();
const actionCreatorAsync = asyncFactory<LoadWWADataState>(actionCreator);

/**
 * WWA のマップデータを読み込む Promise です。
 *     WWALoader は Web Worker で呼び出す形となっています。
 *     Web Worker は Promise とはやり方が違うので、読み込み全体の Promise をこのメソッドでまかないます。
 *     Web Worker で発生する途中経過のメッセージについては、このメソッドに付いているコールバックメソッドを介して実行させます。
 * @param mapdataFileName マップデータのファイル名
 * @param messageCallbackFn message イベント発生時に呼び出すメソッド
 * @param errorCallbackFn エラー発生時で呼び出すメソッド
 */
const loadWWADataPromise = (
    mapdataFileName: string,
    messageCallbackFn: (loaderResponse: LoaderResponse) => void
) => {
    return new Promise<WWAData>(function (resolve, reject) {

        const loaderWorker = new Worker('./wwaload.js');
        
        loaderWorker.postMessage({
            fileName: mapdataFileName
        });

        loaderWorker.onmessage = (event: MessageEvent) => {
            const eventData: LoaderResponse = event.data;

            if (eventData.error !== null) {
                reject({
                    title: 'MapData Error',
                    message: event.data.error.message
                });
                loaderWorker.terminate();

            } else if (eventData.progress !== null) {
                messageCallbackFn(eventData);

            } else if (eventData.wwaData !== null) {
                resolve(eventData.wwaData);
                loaderWorker.terminate();
            }
        };

    });
}

/**
 * イメージ画像を読み込む Promise です。
 * @param imageFileName 
 */
const loadImagePromise = (
    imageFileName: string
) => {
    return new Promise<CanvasImageSource>((resolve, reject) => {

        const imageLoadHandler = () => {
            image.removeEventListener("load", imageLoadHandler);
            image.removeEventListener("error", imageErrorHandler);
            resolve(image);
        };

        const imageErrorHandler = (event: ErrorEvent) => {
            reject({
                title: 'Image Error',
                message: event.message
            });
        };
    
        const image = new Image();
        image.addEventListener("load", imageLoadHandler);
        image.addEventListener("error", imageErrorHandler);
        image.src = imageFileName;
    })
}

/**
 * マップデータ読み込みを行うアクションです。
 */
export const loadMapdata = actionCreatorAsync<LoadWWADataState, void, LoaderError>(
    'Load',
    async (params, dispatch) => {
        // マップデータの読み込み
        const wwaData = await loadWWADataPromise(
            params.mapdataFileName,
            eventData => { dispatch(setLoadingProgress(eventData.progress as LoaderProgress)); }
        );
        dispatch(setMapdata({ wwaData: wwaData }));

        // イメージ画像の読み込み
        const imageData = await loadImagePromise(wwaData.mapCGName);
        dispatch(setImage({ imageSource: imageData }));
    }
);

/**
 * ローディング状態を記録します。
 *     typescript-fsa-redux-thunk では、 開始→エラー/完了 しかアクションを起こすことができません。
 *     このメソッドは、その「開始」と「エラー/完了」の間で発生する途中経過に対応したアクションになります。
 */
const setLoadingProgress = actionCreator<LoaderProgress>("SET_LOADING_PROGRESS");

export const INITIAL_STATE: LoadState = {
    progress: LoadStage.INIT,
    error: null
};

export const LoadReducer = reducerWithInitialState(INITIAL_STATE)
    .case(setLoadingProgress, (state, progress) => ({
        ...state,
        progress: progress.stage
    }))
    .case(loadMapdata.async.started, (state) => ({
        ...state,
        progress: LoadStage.INIT
    }))
    .case(loadMapdata.async.failed, (state, params) => ({
        ...state,
        error: params.error
    }))
    .case(loadMapdata.async.done, (state) => ({
        ...state,
        progress: null
    }))
