import { WWAData } from "@wwawing/common-interface";
import { ipcMain } from "electron";
import express from "express"; "express";
import path from "path";

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
        // TODO: / の場合は page-generator を使用して WWA の HTML を返すように実装する
        app.use("/", express.static(path.dirname(data.absolutePath)));
        // TODO: well-knwon ポートとぶつからないか確かめる
        app.listen(0, () => {
            // TODO: アクセスできる URL を出力するように実装する
            event.reply('testplay-return-url', {});
        });
    });

}
