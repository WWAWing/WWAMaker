import WWAMakerApp from "../core/WWAMakerApp";
import { ipcMain } from "electron";
import getImagePath from "../infra/path/getImagePath";
import loadImage from "../infra/file/loadImage";

export default function setLoadMessages(app: WWAMakerApp) {

    /**
     * [main->renderer] new-wwadata
     * [renderer->main] new-wwadata-process
     * [main->renderer] new-wwadata-complete
     */
    ipcMain.on('new-wwadata', () => {
        app.newMapdata();
    });

    ipcMain.on('open-wwadata', () => {
        app.openWithDialog();
    });

    ipcMain.on('load-image', (event, data: { filePath: string, imageFilename: string }) => {
        if (!data.filePath) {
            throw new Error("ファイルの Path が含まれていません。");
        }
        if (!data.imageFilename) {
            throw new Error("画像のファイルの Path が含まれていません。");
        }
        loadImage(getImagePath(data.filePath, data.imageFilename)).then(buffer => {
            event.reply('load-image-complete', {
                imageBuffer: buffer
            });
        });
    });

}
