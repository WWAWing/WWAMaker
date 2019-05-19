import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import { LoadWWADataAction, progressWWAData, setWWAData, errorWWAData, LoadImageAction } from './MapData';
import { LoaderResponse, LoaderError } from '../classes/WWAData';

function loadMapData(mapdataFileName: string) {
    /**
     * @todo emitter で指定する引数は何の役割を持つか調べる。
     */
    return eventChannel(emitter => {
        const loaderMessageHandler = (event: MessageEvent) => {
            emitter(event.data);

            if (event.data.progress === null) {
                emitter(END);
            }
        }

        const loaderWorker = new Worker('./wwaload.js');
        loaderWorker.postMessage({
            fileName: mapdataFileName
        });
        loaderWorker.addEventListener('message', loaderMessageHandler);

        return () => {
            loaderWorker.removeEventListener('message', loaderMessageHandler);
        }
    });
}

/**
 * 
 * @param mapCGName 
 */
function loadImage(mapCGName: string) {
    return eventChannel(emitter => {
        const imageErrorHandler = (event: ErrorEvent) => {
            emitter({ error: event });
            emitter(END);
        }
        const imageLoadHandler = () => {
            emitter({ image: image });
            emitter(END);
        }

        const image = new Image();
        image.src = mapCGName;
        image.addEventListener('error', imageErrorHandler);
        image.addEventListener('load', imageLoadHandler);

        return () => {
            image.removeEventListener('error', imageErrorHandler);
            image.removeEventListener('load', imageLoadHandler);
        }
    });
}

function* loadMapDataSaga(action: LoadWWADataAction) {
    /**
     * @todo WWAマップデータ読み込みが完了した後にイメージを読み込む流れで進んでいるけれども、もしかしたら間違っているかもしれない。
     */
    const mapDataChannel = yield call(loadMapData, action.payload.mapdataFileName);
    try {
        const channelResult: LoaderResponse = yield take(mapDataChannel);
        if (channelResult.progress !== null) {
            yield put(progressWWAData(channelResult.progress));
        } else if (channelResult.wwaData !== null) {
            yield put(setWWAData(channelResult.wwaData));
        } else {
            yield put(setWWAData(channelResult.error));
        }
    } catch (error) {
        const loaderError: LoaderError = {
            message: error.message,
            name: error.name
        };
        yield put(errorWWAData(loaderError));
    }
}

function* loadImageSaga(action: LoadImageAction) {
    const imageChannel = yield call(loadImage, action.payload.mapCGName);
    try {
        const channelResult = take(imageChannel);
        if (imageChannel.image !== null) {
            /**
             * @todo イメージのセット処理を記述する。
             */
        } else {
            /**
             * @todo イメージのエラー発生を記述する
             */
        }
    } catch (error) {
        /**
         * @todo イメージのエラー発生を記述する
         */
    }
}

function* mySaga() {
    yield takeEvery('LOAD_WWADATA', loadMapDataSaga);
}

export default mySaga;
