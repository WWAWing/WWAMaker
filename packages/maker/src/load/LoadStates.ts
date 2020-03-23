import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { LoadStage, LoaderError, LoaderProgress } from "./Loader";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import WWAData from "../classes/WWAData";

/**
 * [WIP] Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @todo MapData.ts から順次移行する
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
function loadWWADataPromise(
    mapdataFileName: string,
    messageCallbackFn: (event: MessageEvent) => void,
    errorCallbackFn: (event: ErrorEvent) => void
) {
    return new Promise<WWAData>((resolve) => {

        const loaderMessageHandler = (event: MessageEvent) => {
            if (event.data.progress === null) {
                loaderWorker.addEventListener('message', loaderMessageHandler);
                resolve(event.data.WWAData);
            } else {
                messageCallbackFn(event);
            }
        }

        const loaderErrorHandler = (event: ErrorEvent) => {
            errorCallbackFn(event);
        }

        const loaderWorker = new Worker('./wwaload.js');
        loaderWorker.addEventListener('message', loaderMessageHandler);
        loaderWorker.addEventListener('error',loaderErrorHandler);
        loaderWorker.postMessage({
            fileName: mapdataFileName
        });
    })
}

/**
 * マップデータ読み込みを行うアクションです。
 */
export const loadMapdata = actionCreatorAsync<LoadWWADataState, WWAData, LoaderError>(
    'Load',
    async (params, dispatch) => {
        const wwaData = await loadWWADataPromise(
            params.mapdataFileName,
            event => { dispatch(setLoadingProgress(event.data.progress as LoaderProgress)); },
            event => { throw new Error(event.message); }
        );

        return wwaData;
    }
)

/**
 * ローディング状態を記録します。
 *     typescript-fsa-redux-thunk では、 開始→エラー/完了 しかアクションを起こすことができません。
 *     このメソッドは、その「開始」と「エラー/完了」の間で発生する途中経過に対応したアクションになります。
 */
const setLoadingProgress = actionCreator<LoaderProgress>("SET_LOADING_PROGRESS");

const INITIAL_STATE: LoadState = {
    progress: LoadStage.INIT,
    error: null
};

reducerWithInitialState(INITIAL_STATE)
    .case(setLoadingProgress, (state, progress) => ({
        ...state,
        progress: progress.stage
    }))
    .case(loadMapdata.async.started, (state) => ({
        ...state,
        progress: LoadStage.INIT
    }))
    .case(loadMapdata.async.failed, (state, errorData) => ({
        ...state,
        error: {
            title: 'Loader Error',
            message: errorData.error.message
        }
    }))
    /**
     * @todo WWAデータをどこに退避させるか考える
     */
    .case(loadMapdata.async.done, (state) => ({
        ...state,
        progress: null
    }))
