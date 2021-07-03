import { WWAData } from "@wwawing/common-interface";
import { BrowserWindow, dialog, ipcMain } from "electron";
import loadMapData from "../infra/file/loadMapData";
import saveMapData from "../infra/file/saveMapData";
import loadImage from "../infra/file/loadImage";
import { LoaderError } from "@wwawing/loader";
import getImagePath from "../infra/path/getImagePath";

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
    let stage: "MAPDATA" | "IMAGE" = "MAPDATA";
    win.webContents.send('open-wwadata-start', { filePath });
    loadMapData(
        filePath,
        progress => {
            // TODO: レンダラープロセスに何回も送信するのは負荷的に見てどうだろうか？
            win.webContents.send('open-wwadata-progress', {
                loaderProgress: progress
            });
        }
    )
    .then(wwaData => {
        win.webContents.send('open-wwadata-complete', {
            data: wwaData
        });
        stage = "IMAGE";
        const imagePath = getImagePath(filePath, wwaData.mapCGName);
        return loadImage(imagePath)
    })
    .then(imageBuffer => {
        win.webContents.send('load-image-complete', {
            imageBuffer: imageBuffer
        });
    })
    .catch(err => {
        switch (stage) {
            case "MAPDATA":
                win.webContents.send('open-wwadata-error', {
                    loaderError: err as LoaderError
                });
                break;
            case "IMAGE":
                win.webContents.send('load-image-error', {
                    err: err as NodeJS.ErrnoException
                });
        }
    });

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
        if (data === undefined) {
            throw new Error("データが来ていません。");
        }
        saveMapData(filePath, data, err => {
            if (err) {
                throw err;
            }
        })
    });

}
