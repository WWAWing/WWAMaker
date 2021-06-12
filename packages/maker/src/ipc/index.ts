import { WWAData } from '@wwawing/common-interface';
import { LoaderError, LoaderProgress } from '@wwawing/loader';
import { ipcRenderer } from 'electron';
import { loadImage, setLoadingError, setLoadingProgress } from '../load/LoadStates';
import { closeMapdata, setMapdata, Store } from '../State';

// TODO: データの型を app のものと共通化する
ipcRenderer.on('open-wwadata-progress', (event, progress: { loaderProgress: LoaderProgress }) => {
    Store.dispatch(setLoadingProgress(progress.loaderProgress));
});

ipcRenderer.on('open-wwadata-error', (event, error: { loaderError: LoaderError }) => {
    Store.dispatch(setLoadingError(error.loaderError));
});

ipcRenderer.on('open-wwadata-complete', (event, data: { filePath: String, data: WWAData } ) => {
    Store.dispatch(closeMapdata());
    Store.dispatch(setMapdata(data.data));
    const imagePath = data.filePath.substring(0, data.filePath.lastIndexOf("/")) + "/" + data.data.mapCGName;
    Store.dispatch(loadImage(imagePath));
    // FIXME 何も起こらない
});
