import { WWAData } from '@wwawing/common-interface';
import { LoaderError, LoaderProgress } from '@wwawing/loader';
import { ipcRenderer } from 'electron';
import { loadMapdata, setLoadingError, setLoadingProgress } from '../load/LoadStates';
import { Store } from '../State';

// TODO: データの型を app のものと共通化する
ipcRenderer.on('open-wwadata-progress', (event, progress: { loaderProgress: LoaderProgress }) => {
    Store.dispatch(setLoadingProgress(progress.loaderProgress));
});

ipcRenderer.on('open-wwadata-error', (event, error: { loaderError: LoaderError }) => {
    Store.dispatch(setLoadingError(error.loaderError));
});

ipcRenderer.on('open-wwadata-complete', (event, data: { filePath: string, data: WWAData } ) => {
    Store.dispatch(loadMapdata(data));
});
