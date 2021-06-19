import { WWAData } from "@wwawing/common-interface";
import { BrowserWindow, dialog, ipcMain } from "electron";
import loadMapData from "../infra/file/loadMapData";
import saveMapData from "../infra/file/saveMapData";

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

export function save(win: BrowserWindow) {

    const filePath = dialog.showSaveDialogSync({
        title: 'マップデータを保存',
        filters: FILE_FILTERS,
        properties: [
            'createDirectory'
        ]
    });
    if (filePath === undefined) {
        return;
    }

    win.webContents.send('save-wwadata-request-wwadata');
    console.log('WWAData request sent.');
    ipcMain.on('save-wwadata-receive-wwadata', (event, data: WWAData) => {
        console.log('received WWAData. saving...');
        saveMapData(filePath, data, err => {
            console.log('saving file path: ' + filePath);
            if (err) {
                throw err;
            }
            // DEBUG: ファイルの保存を完了するメッセージ
            console.log('done!');
        })
    });

}
