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
                wwa: {
                    resources: {
                        mapData: mapdataFilename,
                        // TODO: オフラインで使用できないので @wwawing/engine などから取得するようにする
                        wwaJs: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.js",
                        wwaCss: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.css"
                    }
                }
            }));
        });

        app.get("/" + mapdataFilename, (req, res) => {
            res.set('Content-Type', 'application/octet-stream');
            // FIXME: JSON データをそのままバイナリ化したようなマップデータファイルが返ってくる
            Saver(data.wwaData).then(value => {
                res.send(value);
            });
        });

        app.use("/", express.static(dirPath));

        // TODO: well-knwon ポートとぶつからないか確かめる
        const server = app.listen(0, () => {
            const serverAddress = server.address();
            // DEBUG: サーバーアドレスを表示
            console.log(serverAddress);
            event.reply('testplay-return-url', {
                url: typeof serverAddress === "string" ? serverAddress : `http://localhost:${serverAddress?.port}`
            });
        });
    });

}
