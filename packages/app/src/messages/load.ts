import { ipcMain } from "electron";
import getImagePath from "../infra/path/getImagePath";
import loadImage from "../infra/file/loadImage";

ipcMain.on('load-image', (event, data: { filePath: string, imageFilename: string }) => {
    loadImage(getImagePath(data.filePath, data.imageFilename)).then(buffer => {
        event.reply('load-image-complete', {
            imageBuffer: buffer
        });
    });
});
