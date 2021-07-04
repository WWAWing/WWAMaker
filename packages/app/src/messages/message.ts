import { ipcMain } from "electron";
import WWAMakerApp from "../core/WWAMakerApp";

export default function setMessageMessages(app: WWAMakerApp) {

    ipcMain.handle('message-dialog-warning', (event, data: { message: string }) => {
        if (!data.message) {
            throw new Error("メッセージが定義されていません。");
        }
        app.warningDialog(data.message)
            .then(value => {
                return value;
            });
    });

}
