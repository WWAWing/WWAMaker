import { WWAData } from "@wwawing/common-interface";
import { render } from "@wwawing/page-generator";
import { ipcMain } from "electron";
import express from "express"; "express";
import path from "path";
import Saver from "../../../saver/lib";

type TestPlayPayload = {
    wwaData: WWAData,
    absolutePath: string
};

// 300: Ver3.x, 10: WWA Maker Prod & Dev(00 は WWA Wing?), 1: テストプレイ
export const DEBUG_SERVER_PORT = 3311;

export default function setTestPlayMessages() {

    ipcMain.on('testplay', (event, data: TestPlayPayload) => {
        if (!data.wwaData) {
            throw new Error("WWA データが含まれていません。");
        }
        if (!data.absolutePath) {
            throw new Error("マップデータの絶対 Path が含まれていません。");
        }

        const app = express();
        const dirPath = path.dirname(data.absolutePath);
        const mapdataFilename = path.basename(data.absolutePath);

        app.get("/", (req, res) => {
            res.send(render({
                page: {
                    additionalCssFiles: [
                        // TODO: オフラインで使用できないので @wwawing/all などから取得するようにする
                        "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/style.css"
                    ]
                },
                wwa: {
                    resources: {
                        mapData: mapdataFilename,
                        wwaJs: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.js",
                        wwaCss: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.css"
                    }
                }
            }));
        });

        app.get("/" + mapdataFilename, (req, res) => {
            res.set('Content-Type', 'application/octet-stream');
            Saver(data.wwaData).then(value => {
                res.send(Buffer.from(value));
            });
        });

        app.use("/", express.static(dirPath));

        // FIXME: テストプレイ画面を閉じてもポートは閉じてない
        const server = app.listen(DEBUG_SERVER_PORT, () => {
            const serverAddress = server.address();
            event.reply('testplay-return-url', {
                url: typeof serverAddress === "string" ? serverAddress : `http://localhost:${serverAddress?.port}`
            });
        });
    });

}
