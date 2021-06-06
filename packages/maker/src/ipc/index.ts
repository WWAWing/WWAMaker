import { WWAData } from '@wwawing/common-interface';
import { ipcRenderer } from 'electron';

// TODO: データの型を app のものと共通化する
ipcRenderer.on('open-wwadata-complete', (event, data: { data: WWAData } ) => {
    // TODO: Redux のアクションを実行し、 WWA のデータをステートに格納できるようにする
});
