import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import { LoadWWADataAction, progressWWAData, setWWAData, errorWWAData, LoadImageAction, setImage, errorImage, ImageActionType, loadImage } from './MapData';
import { LoaderResponse, MakerError } from '../classes/WWAData';

function loadWWAData(mapdataFileName: string) {
    return eventChannel(emitter => {
        const loaderMessageHandler = (event: MessageEvent) => {
            emitter(event.data);

            if (event.data.progress === null) {
                emitter(END);
            }
        }

        const loaderWorker = new Worker('./wwaload.js');
        loaderWorker.addEventListener('message', loaderMessageHandler);
        loaderWorker.postMessage({
            fileName: mapdataFileName
        });

        return () => {
            loaderWorker.removeEventListener('message', loaderMessageHandler);
        }
    });
}

/**
 * メソッド loadMapCG の emitter で返す値です。
 * @see loadMapCG
 */
interface ImageChannelResult {
    type: ImageActionType,
    payload: ErrorEvent | CanvasImageSource
}

/**
 * @param mapCGName 
 */
function loadMapCG(mapCGName: string) {
    return eventChannel(emitter => {
        const imageErrorHandler = (event: ErrorEvent) => {
            emitter({ type: 'ERROR_IMAGE', payload: event });
            emitter(END);
        }
        const imageLoadHandler = () => {
            emitter({ type: 'SET_IMAGE', payload: image });
            emitter(END);
        }

        const image = new Image();
        image.addEventListener('error', imageErrorHandler);
        image.addEventListener('load', imageLoadHandler);
        image.src = mapCGName;
        
        return () => {
            image.removeEventListener('error', imageErrorHandler);
            image.removeEventListener('load', imageLoadHandler);
        }
    });
}

/**
 * マップデータの読み込みすべてを担当する Saga メソッドです。
 * @param action 
 */
function* loadMapDataSaga(action: LoadWWADataAction) {
    try {
        const mapCGName = yield call(loadWWADataSaga, action);
        yield call(loadMapCGSaga, loadImage(mapCGName));
    } catch (error) {
        const errorData: MakerError = {
            title: error.name,
            message: error.message
        };
        yield put(errorWWAData(errorData));
    }
}

function* loadWWADataSaga(action: LoadWWADataAction) {
    const mapDataChannel = yield call(loadWWAData, action.payload.mapdataFileName);
    while (true) {
        const channelResult: LoaderResponse = yield take(mapDataChannel);
        if (channelResult.progress !== null) {
            yield put(progressWWAData(channelResult));
        } else if (channelResult.wwaData !== null) {
            yield put(setWWAData(channelResult));
            return channelResult.wwaData.mapCGName;
        } else {
            yield put(errorWWAData(channelResult));
        }
    }
}

function* loadMapCGSaga(action: LoadImageAction) {
    const imageChannel = yield call(loadMapCG, action.payload.mapCGName);
    while (true) {
        const channelResult: ImageChannelResult = yield take(imageChannel);
        switch (channelResult.type) {
            case 'SET_IMAGE':
                yield put(setImage(channelResult.payload));
                break;
            case 'ERROR_IMAGE':
            default:
                yield put(errorImage(channelResult.payload));
        }
    }
}

function* mySaga() {
    yield takeEvery('LOAD_WWADATA', loadMapDataSaga);
}

export default mySaga;
