import { WWAData } from "@wwawing/common-interface";
import { NodeEventEmitter } from "@wwawing/event-emitter";
import { LoaderError, WWALoader } from "@wwawing/loader";
import path from "path";

export default function wwamapData(): Promise<WWAData> {
    return loadMapData(path.join(__dirname, "resources", "wwamap.dat"));
}

function loadMapData(filePath: string) {
    return new Promise<WWAData>((resolve, reject) => {
        const emitter = new NodeEventEmitter();
        const loader = new WWALoader(filePath, emitter);
    
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
