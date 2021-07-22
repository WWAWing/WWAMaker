import { WWAData } from "@wwawing/common-interface";
import { BrowserWindow, dialog, ipcMain } from "electron";
import loadMapData from "../infra/file/loadMapData";
import saveMapData from "../infra/file/saveMapData";
import loadImage from "../infra/file/loadImage";
import { LoaderError } from "@wwawing/loader";
import getImagePath from "../infra/path/getImagePath";
import fileFilters from "../infra/file/fileFilters";
import path from "path";
import WWAMakerDebugServer from "./WWAMakerDebugServer";
import { Server } from "http";

/**
 * WWA Maker の Electron アプリケーションです。
 */
export default class WWAMakerApp {
    private win: BrowserWindow;
    private debugServer: WWAMakerDebugServer;

    public constructor(win: BrowserWindow) {
        this.win = win;
        this.debugServer = new WWAMakerDebugServer();
    }

    /**
     * 警告メッセージを表示します。
     * @param message メッセージテキスト
     * @returns メッセージ表示後、 OK ボタンを押したあとに解決される Promise (返ってくる値は 0 固定)
     */
    public warningDialog(message: string): Promise<Electron.MessageBoxReturnValue> {
        return dialog.showMessageBox(this.win, {
            title: "注意！",
            message,
            type: "warning"
        });
    }

    /**
     * 情報メッセージを表示します。
     * @param title タイトル
     * @param message メッセージテキスト
     * @returns メッセージ表示後、 OK ボタンを押したあとに解決される Promise (返ってくる値は 0 固定)
     */
    public infoDialog(title: string, message: string): Promise<Electron.MessageBoxReturnValue> {
        return dialog.showMessageBox(this.win, {
            title,
            message,
            type: "info"
        });
    }

    /**
     * エラーメッセージを表示します。
     * @param title ダイアログのタイトル
     * @param message ダイアログのテキスト
     */
    public errorDialog(title: string, message: string) {
        return dialog.showErrorBox(title, message);
    }

    public newMapdata() {
        dialog.showMessageBox(this.win, {
            title: "マップの新規作成",
            message: "マップの新規作成をします。\n現在、編集中のデータは失われますが、よろしいですか？",
            buttons: ["OK", "Cancel"],
            type: "question"
        }).then(response => {
            if (response.response === 0) {
                this.win.webContents.send('new-wwadata-process');
            }
        });
        ipcMain.once('new-wwadata-complete', () => {
            this.infoDialog(
                "マップの新規作成",
                "マップを新規作成しました。\n" +
                "画面には何も表示されなくなりますがこれが正常です。\n" +
                "使用する GIF 画像ファイルを選択後、\n" +
                "新たにパーツを作成してマップに配置していってください。",
            );
        });
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
                case "MAPDATA": {
                    const loaderError = err as LoaderError;
                    this.errorDialog("エラー！", loaderError.message);
                    break;
                }
                case "IMAGE": {
                    const nodeError = err as NodeJS.ErrnoException;
                    // 画像ファイル名が特定できない場合は別にエラーメッセージを出す必要がありますが、原作を尊重するためにあえて空にしています。
                    const errorPath = nodeError.path ?? "";
                    const imageFilename = path.basename(errorPath);
                    this.errorDialog("注意",
                        "GIF画像ファイル「" + imageFilename + "」がオープンできません。\n" +
                        "ファイルが存在するか、他のアプリケーションにより使用されていないかを確認してください。"
                    );
                }
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
        ipcMain.once('save-wwadata-receive-wwadata', (event, data: { data: WWAData, filePath: string }) => {
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

    public showTestPlay() {
        this.win.webContents.send('show-testplay');
    }

    /**
     * テストプレイを開始します。
     * @see WWAMakerDebugServer.launch
     * @param wwaData
     * @param absolutePath
     * @returns
     */
    public startTestPlay(wwaData: WWAData, absolutePath: string): Promise<Server> {
        return this.debugServer.launch(wwaData, absolutePath);
    }

    /**
     * テストプレイを終了します。
     */
    public endTestPlay() {
        this.debugServer.exit();
    }

    /**
     * 境界線の表示を切り替えます。
     */
    public toggleGrid() {
        this.win.webContents.send('view-toggle-grid');
    }

    /**
     * インフォパネルの表示を切り替えます。
     */
    public toggleInfopanel() {
        this.win.webContents.send('view-toggle-infopanel');
    }

    public quit() {
        // TODO: マップデータに変更がある場合は警告を表示するようにする
        this.win.close();
    }
}
