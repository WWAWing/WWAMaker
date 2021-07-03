import { WWAData } from "@wwawing/common-interface";
import { BrowserWindow, dialog, ipcMain } from "electron";
import loadMapData from "../infra/file/loadMapData";
import saveMapData from "../infra/file/saveMapData";
import loadImage from "../infra/file/loadImage";
import { LoaderError } from "@wwawing/loader";
import getImagePath from "../infra/path/getImagePath";
import fileFilters from "../infra/file/fileFilters";

/**
 * WWA Maker の Electron アプリケーションです。
 */
export default class WWAMakerApp {
    private win: BrowserWindow;

    public constructor(win: BrowserWindow) {
        this.win = win;
    }

    /**
     * ファイルを読み込みます。
     * @param filePath ファイルの Path
     */
    public open(filePath: string) {
        let stage: "MAPDATA" | "IMAGE" = "MAPDATA";
        this.win.webContents.send('open-wwadata-start', { filePath });
        loadMapData(
            filePath,
            progress => {
                // TODO: レンダラープロセスに何回も送信するのは負荷的に見てどうだろうか？
                this.win.webContents.send('open-wwadata-progress', {
                    loaderProgress: progress
                });
            }
        )
        .then(wwaData => {
            this.win.webContents.send('open-wwadata-complete', {
                data: wwaData
            });
            stage = "IMAGE";
            const imagePath = getImagePath(filePath, wwaData.mapCGName);
            return loadImage(imagePath)
        })
        .then(imageBuffer => {
            this.win.webContents.send('load-image-complete', {
                imageBuffer: imageBuffer
            });
        })
        .catch(err => {
            switch (stage) {
                case "MAPDATA":
                    this.win.webContents.send('open-wwadata-error', {
                        loaderError: err as LoaderError
                    });
                    break;
                case "IMAGE":
                    this.win.webContents.send('load-image-error', {
                        err: err as NodeJS.ErrnoException
                    });
            }
        });
    }

    /**
     * ダイアログで開き、指定したファイルを開きます。
     * @returns 
     */
    public openWithDialog() {
        const filePaths = dialog.showOpenDialogSync({
            title: 'マップデータを開く',
            filters: fileFilters
        });
        if (filePaths === undefined) {
            return;
        }

        const filePath = filePaths[0];
        this.open(filePath);
    }

    /**
     * ファイルを上書き保存します。
     */
    public save() {
        this.makeSave(filePath => filePath);
    }

    /**
     * ファイルを名前を付けて保存します。
     * @param filePath ファイルの Path
     */
    public saveAs(filePath: string) {
        this.makeSave(() => filePath);
    }

    /**
     * ダイアログで開き、指定したファイルで保存します。
     */
    public saveWithDialog() {
        const filePath = dialog.showSaveDialogSync({
            title: 'マップデータを保存',
            filters: fileFilters,
            properties: [
                'createDirectory'
            ]
        });
        if (filePath === undefined) {
            return;
        }

        this.saveAs(filePath);
    }

    private makeSave(filePathFunc: (filePath: string) => string) {
        this.win.webContents.send('save-wwadata-request-wwadata');
        // TODO: messages ディレクトリに移行したほうが良いかもしれないが、処理の流れがわからなくなるのでこのままでも良いかもしれない
        ipcMain.on('save-wwadata-receive-wwadata', (event, data: { data: WWAData, filePath: string }) => {
            if (data.data === undefined) {
                throw new Error("WWA データが含まれていません。");
            }
            if (data.filePath === undefined) {
                throw new Error("ファイルの Path が含まれていません。");
            }
            const savedFilePath = filePathFunc(data.filePath);
            if (savedFilePath !== data.filePath) {
                event.reply('save-wwadata-update-filepath', { filePath: savedFilePath });
            }
            saveMapData(savedFilePath, data.data, err => {
                if (err) {
                    throw err;
                }
            })
        });
    }
}
