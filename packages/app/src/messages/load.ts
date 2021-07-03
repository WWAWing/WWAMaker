import { ipcMain } from "electron";
import getImagePath from "../infra/path/getImagePath";
import loadImage from "../infra/file/loadImage";

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
