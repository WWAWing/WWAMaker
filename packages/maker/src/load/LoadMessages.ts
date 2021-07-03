import { WWAData } from '@wwawing/common-interface';
import { LoaderError, LoaderProgress } from '@wwawing/loader';
import { ipcRenderer } from 'electron';
import { completeLoading, setMapdataLoadingError, setLoadingProgress, startImageLoading, startMapdataLoading, setImageLoadingError } from './LoadStates';
import { Store } from '../State';
import { closeImage, setImage } from '../image/ImageState';
import { closeMapdata, setMapdata } from '../wwadata/WWADataState';

/**
 * WWAデータの読み込み進捗について
 * 読み込みステージは下記の手順に分類されます。
 * 1. マップデータ読み込み
 * 2. 画像読み込み
 */

ipcRenderer.on('open-wwadata-start', (event, data: { filePath: string }) => {
    if (!data.filePath) {
        throw new Error("ファイルの Path が含まれていません。");
    }
    Store.dispatch(closeMapdata());
    Store.dispatch(closeImage());
    Store.dispatch(startMapdataLoading(data.filePath));
});

ipcRenderer.on('open-wwadata-progress', (event, progress: { loaderProgress: LoaderProgress }) => {
    if (!progress.loaderProgress) {
        throw new Error("読み込み進捗情報が含まれていません。");
    }
    Store.dispatch(setLoadingProgress(progress.loaderProgress));
});

ipcRenderer.on('open-wwadata-error', (event, error: { loaderError: LoaderError }) => {
    if (!error.loaderError) {
        throw new Error("エラー情報が含まれていません。");
    }
    Store.dispatch(setMapdataLoadingError(error.loaderError));
});

ipcRenderer.on('open-wwadata-complete', (event, data: { data: WWAData } ) => {
    if (!data.data) {
        throw new Error("WWAデータが含まれていません。");
    }
    Store.dispatch(setMapdata(data.data));
    // 画像データの読み込みはメインプロセスの方で勝手に始まってます。
    Store.dispatch(startImageLoading());
});

ipcRenderer.on('load-image-complete', (event, data: { imageBuffer: Buffer }) => {
    if (!data.imageBuffer) {
        throw new Error("画像データが含まれていません。");
    }
    Store.dispatch(setImage(data.imageBuffer));
    Store.dispatch(completeLoading());
});

ipcRenderer.on('load-image-error', (event, data: { err: NodeJS.ErrnoException }) => {
    if (!data.err) {
        throw new Error("エラー情報が含まれていません。")
    }
    Store.dispatch(setImageLoadingError(data.err));
});
