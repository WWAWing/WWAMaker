import { WWAData } from '@wwawing/common-interface';
import { NodeEventEmitter } from '@wwawing/event-emitter';
import { LoaderError, LoaderProgress, WWALoader } from '@wwawing/loader';

/**
 * ファイルを読み込みます。
 * @param filePath ファイルのPath
 */
export default function open(
    filePath: string,
    onProgressCallback: (progress: LoaderProgress) => void,
    onErrorCallback: (error: LoaderError) => void,
    onCompleteCallback: (wwaData: WWAData) => void
) {
    
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

        const handleProgress = emitter.addListener("progress", onProgressCallback);
        const handleError = emitter.addListener("error", onErrorCallback);

        loader.requestAndLoadMapData();
    })
    .then(onCompleteCallback)
    .catch(reason => console.error(reason));

}
