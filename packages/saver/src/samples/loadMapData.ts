import { WWAData } from "@wwawing/common-interface";
import { NodeEventEmitter } from "@wwawing/event-emitter";
import { LoaderError, WWALoader } from "@wwawing/loader";
import path from "path";

/**
 * マップデータを読み込みます。テストで使用します。
 * @param filePath resources 下のマップデータファイル名
 * @returns WWAマップが含まれた Promise
 */
export default function loadMapData(filePath: string) {
    return new Promise<WWAData>((resolve, reject) => {
        // TODO: package の root ディレクトリの Path を取得する方法が無いか探す
        const absoluteFilePath = path.join(__dirname, "..", "..", "resources", filePath);
        const emitter = new NodeEventEmitter();
        const loader = new WWALoader(absoluteFilePath, emitter);
    
        const handleMapData = emitter.addListener("mapData", wwaMap => {
            emitter.removeListener("mapData", handleMapData);
            emitter.removeListener("error", handleError);
            resolve(wwaMap);
        });
    
        const handleError = emitter.addListener("error", (error: LoaderError) => {
            reject(error);
        });
    
        loader.requestAndLoadMapData();
    });
}
