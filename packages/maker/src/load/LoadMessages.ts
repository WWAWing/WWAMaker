import { WWAData } from '@wwawing/common-interface';
import { LoaderError, LoaderProgress } from '@wwawing/loader';
import { ipcRenderer } from 'electron';
import { completeLoading, loadMapdata, setMapdataLoadingError, setLoadingProgress, startImageLoading, startMapdataLoading, setImageLoadingError } from './LoadStates';
import { Store } from '../State';
import { setEncodedImage } from '../image/ImageState';

/**
 * WWAデータの読み込み進捗について
 * 読み込みステージは下記の手順に分類されます。
 * 1. マップデータ読み込み
 * 2. 画像読み込み
 */

// TODO: データの型を app のものと共通化する
ipcRenderer.on('open-wwadata-start', () => {
    Store.dispatch(startMapdataLoading());
});

ipcRenderer.on('open-wwadata-progress', (event, progress: { loaderProgress: LoaderProgress }) => {
    Store.dispatch(setLoadingProgress(progress.loaderProgress));
});

ipcRenderer.on('open-wwadata-error', (event, error: { loaderError: LoaderError }) => {
    Store.dispatch(setMapdataLoadingError(error.loaderError));
});

ipcRenderer.on('open-wwadata-complete', (event, data: { filePath: string, data: WWAData } ) => {
    Store.dispatch(loadMapdata(data));
    // 画像データの読み込みはメインプロセスの方で勝手に始まってます。
    Store.dispatch(startImageLoading());
});

ipcRenderer.on('load-image-complete', (event, data: { imageUrl: string }) => {
    Store.dispatch(setEncodedImage(data.imageUrl));
    Store.dispatch(completeLoading());
});

ipcRenderer.on('load-image-error', (event, data: { err: NodeJS.ErrnoException }) => {
    Store.dispatch(setImageLoadingError(data.err));
});
