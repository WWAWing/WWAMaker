import { BrowserWindow, dialog } from "electron";
import loadMapData from "../infra/file/loadMapData";

const FILE_FILTERS = [
    { name: 'WWA マップデータ', extensions: ['dat'] },
    { name: 'すべてのファイル', extensions: ['*'] }
];

export function open(win: BrowserWindow) {

    const filePath = dialog.showOpenDialogSync({
        title: 'マップデータを開く',
        filters: FILE_FILTERS
    });
    if (filePath === undefined) {
        return;
    }
    
    loadMapData(filePath[0], wwaData => {
        win.webContents.send('open-wwadata-complete', {
            data: wwaData
        });
    });

}
