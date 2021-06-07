import { BrowserWindow, dialog } from "electron";
import loadMapData from "../infra/file/loadMapData";

const FILE_FILTERS = [
    { name: 'WWA マップデータ', extensions: ['dat'] },
    { name: 'すべてのファイル', extensions: ['*'] }
];

export function open(win: BrowserWindow) {

    const filePaths = dialog.showOpenDialogSync({
        title: 'マップデータを開く',
        filters: FILE_FILTERS
    });
    if (filePaths === undefined) {
        return;
    }

    const filePath = filePaths[0];
    loadMapData(
        filePath,
        progress => {
            // TODO: レンダラープロセスに何回も送信するのは負荷的に見てどうだろうか？
            win.webContents.send('open-wwadata-progress', {
                loaderProgress: progress
            });
        },
        error => {
            win.webContents.send('open-wwadata-error', {
                loaderError: error
            });
        },
        wwaData => {
            win.webContents.send('open-wwadata-complete', {
                filePath,
                data: wwaData
            });
        }
    );

}
