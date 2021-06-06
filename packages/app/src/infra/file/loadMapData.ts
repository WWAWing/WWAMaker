import { WWAData } from '@wwawing/common-interface';
import { NodeEventEmitter } from '@wwawing/event-emitter';
import { WWALoader } from '@wwawing/loader';
import { ipcMain } from 'electron';

/**
 * ファイルを読み込みます。
 * @param filePath ファイルのPath
 */
export default function open(filePath: string, onCompleteCallback: (wwaData: WWAData) => void) {
    
    // FROM wwamaker-maker/src/loac/LoadPromises.ts
    new Promise<WWAData>((resolve, reject) => {
        const emitter = new NodeEventEmitter();
        const loader = new WWALoader(filePath, emitter);

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
    })
    .then(onCompleteCallback)
    .catch(reason => console.error(reason));

}
