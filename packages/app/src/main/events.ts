import { WWAData } from "@wwawing/common-interface";
// FIXME: Must use import to load ES Module
import { NodeEventEmitter } from "@wwawing/event-emitter";
import { WWALoader } from "@wwawing/loader";
import { dialog, ipcMain } from "electron";

const FILE_FILTERS = [
    { name: 'WWA マップデータ', extensions: ['dat'] },
    { name: 'すべてのファイル', extensions: ['*'] }
];

export function open() {

    const filePath = dialog.showOpenDialogSync({
        title: 'マップデータを開く',
        filters: FILE_FILTERS
    });
    if (filePath === undefined) {
        return;
    }
    
    // FROM wwamaker-maker/src/loac/LoadPromises.ts
    new Promise<WWAData>((resolve, reject) => {
        const emitter = new NodeEventEmitter();
        const loader = new WWALoader(filePath[0], emitter);

        const handleMapData = emitter.addListener("mapData", wwaMap => {
            emitter.removeListener("mapData", handleMapData);
            emitter.removeListener("progress", handleProgress);
            emitter.removeListener("error", handleError);
            resolve(wwaMap);
        });

        const handleProgress = emitter.addListener("progress", progress => {
            // TODO: IPC 通信をつける
        });

        const handleError = emitter.addListener("error", error => {
            reject(error);
        });

        loader.requestAndLoadMapData();
    }).then(wwaData => {
        // DEBUG: 読み込み完了後の WWA マップデータの中身
        console.log(wwaData);
        ipcMain.handle('open-wwadata-complete', event => {
            // DEBUG: 読み込み完了後のイベントデータと WWA マップデータの中身
            console.log(wwaData, event);
            return wwaData;
        });
    });

}
