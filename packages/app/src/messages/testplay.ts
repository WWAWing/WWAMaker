import WWAMakerApp from "../core/WWAMakerApp";
import { WWAData } from "@wwawing/common-interface";
import { ipcMain } from "electron";

type TestPlayPayload = {
    wwaData: WWAData,
    absolutePath: string
};

export default function setTestPlayMessages(app: WWAMakerApp) {

    ipcMain.on('testplay', (event, data: TestPlayPayload) => {
        if (!data.wwaData) {
            throw new Error("WWA データが含まれていません。");
        }
        if (!data.absolutePath) {
            throw new Error("マップデータの絶対 Path が含まれていません。");
        }

        app.startTestPlay(data.wwaData, data.absolutePath);
    });

}
