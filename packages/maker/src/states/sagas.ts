import { call, put, takeEvery } from 'redux-saga/effects';
import { LoadWWADataAction, progressWWAData, setWWAData, errorWWAData, LoadImageAction } from './MapData';
import { LoaderResponse, LoaderError } from '../classes/WWAData';

/**
 * @param mapdataFileName マップデータのファイル名
 */
function wwaLoadPromise(mapdataFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const loaderWorker = new Worker('./wwaload.js');
        loaderWorker.postMessage({
            fileName: mapdataFileName
        });
        loaderWorker.onmessage = (event: MessageEvent) => {
            if (event.data.wwaData !== null) {
                resolve();
            } else if (event.data.error !== null) {
                reject();
            }
        };
    });
}

function imageLoadPromise(mapCGName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = mapCGName;
        image.onerror = () => {
            reject();
        }
        image.onload = () => {
            resolve();
        }
    });
}

function* loadWWAData(action: LoadWWADataAction) {
    try {
        /**
         * @todo WWAマップデータ読み込みが完了した後にイメージを読み込む流れで進んでいるけれども、もしかしたら間違っているかもしれない。
         */
        const wwaData = yield call(wwaLoadPromise, action.payload.mapdataFileName);
        yield put(setWWAData(wwaData));
        const image = yield call(imageLoadPromise, wwaData.mapCGName);
        /**
         * @todo ここからどうしよう？
         */
    } catch (error) {
        const loaderError: LoaderError = {
            message: error.message,
            name: error.name
        };
        yield put(errorWWAData(loaderError));
    }
}

function* mySaga() {
    yield takeEvery('LOAD_WWADATA', loadWWAData);
}

export default mySaga;
