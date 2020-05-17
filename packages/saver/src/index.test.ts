import { WWALoader } from "@wwawing/loader";
import { NodeEventEmitter } from "@wwawing/event-emitter";
import Saver from ".";
import fs from "fs";

test("saved file equals mapdata file", (done) => {
    const TARGET_MAPDATA_FILENAME = "../resources/wwamap.dat";

    const nodeEmitter = new NodeEventEmitter();
    const loader = new WWALoader(TARGET_MAPDATA_FILENAME, nodeEmitter);

    const handleMepData = nodeEmitter.addListener("mapdata", wwaData => {
        nodeEmitter.removeListener("mapdata", handleMepData);
        nodeEmitter.removeListener("error", handleError);

        Saver(wwaData).then((saverFileBuffer) => {

            fs.readFile(TARGET_MAPDATA_FILENAME, (err, sourceFileBuffer) => {
                if (err) {
                    done(err);
                }
    
                const differenceBytes = saverFileBuffer.filter((byte, byteIndex) => {
                    if (byteIndex >= sourceFileBuffer.length) {
                        return true;
                    }
                    const sourceByte = sourceFileBuffer[byteIndex];
                    return byte !== sourceByte;
                }).length;
    
                console.log("DONE!");
                console.log(`${differenceBytes} バイト分違いがありました。`);
                done();
            });

        });
    });

    const handleError = nodeEmitter.addListener("error", (error) => {
        done(error);
    });

    loader.requestAndLoadMapData();
});
