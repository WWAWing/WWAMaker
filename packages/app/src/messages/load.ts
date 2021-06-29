import { ipcMain } from "electron";
import loadImage from "../infra/file/loadImage";

ipcMain.on('load-image', (event, data: { imageFilePath: string }) => {
    loadImage(data.imageFilePath).then(buffer => {
        event.reply('load-image-complete', {
            imageBuffer: buffer
        });
    });
});
