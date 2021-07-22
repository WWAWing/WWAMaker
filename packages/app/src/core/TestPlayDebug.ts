import { WWAData } from "@wwawing/common-interface";
import { Server } from "http";
import express from "express";
import path from "path";
import { render } from "@wwawing/page-generator";
import Saver from "wwamaker-saver";
import { BrowserWindow, ipcMain } from "electron";

/**
 * テストプレイを行うにあたって必要な情報
 */
type TestPlayRequirements = {
    wwaData: WWAData,
    absolutePath: string
};

/**
 * WWA Maker のテストプレイを行うウインドウとその内部で動作しているデバッグサーバーを管理するクラスです。
 * テストプレイを行うと、内部で express を起動し、マップデータのあるディレクトリを参照します。
 */
export default class TestPlayDebug {

    private win: BrowserWindow;

    private server: Server | null;

    private static DEBUG_SERVER_PORT = 3311;

    constructor(win: BrowserWindow) {
        this.win = win;
        this.server = null;
    }

    /**
     * デバッグサーバーを起動し、 Node のサーバーインスタンスを内部に格納します。
     * @param wwaData WWA のマップデータオブジェクト
     * @param absolutePath WWA のマップデータファイルへの絶対 Path
     */
    public launch(wwaData: WWAData, absolutePath: string): void {
        // FIXME: 閉じた後に再度テストプレイをすると Object has been destroyed になる
        if (this.server === null) {
            const expressApp = express();
            const dirPath = path.dirname(absolutePath);
            const mapdataFilename = path.basename(absolutePath);

            expressApp.get("/", (req, res) => {
                res.send(render(TestPlayDebug.makePageGeneratorConfig(mapdataFilename)));
            });

            expressApp.get("/" + mapdataFilename, (req, res) => {
                res.set('Content-Type', 'application/octet-stream');
                Saver(wwaData).then(value => {
                    res.send(Buffer.from(value));
                });
            });

            expressApp.use("/", express.static(dirPath));

            this.server = expressApp.listen(TestPlayDebug.DEBUG_SERVER_PORT);
        }

        const address = this.server.address();
        if (address === null) {
            throw new Error("サーバーのアドレスの取得に失敗しました。");
        }

        this.win.loadURL(
            typeof address === "string" ? address : `http://localhost:${address.port}`
        );
        this.win.show();
    }

    /**
     * テストプレイに必要なデータをレンダラープロセスから持ってきます。
     * @returns テストプレイに必要なデータ ({@link TestPlayRequirements}) が含まれたオブジェクトの Promise
     */
    public requestWWAData(): Promise<TestPlayRequirements> {
        return new Promise((resolve, reject) => {
            this.win.webContents.send('testplay-request-data');
            ipcMain.once('testplay', (event, data: TestPlayRequirements) => {
                if (!data.wwaData) {
                    reject("WWAデータが含まれていません。");
                }
                if (!data.absolutePath) {
                    reject("マップデータファイルへの絶対 Path が含まれていません。")
                }
                resolve(data);
            });
        });
    }

    /**
     * 内部に格納しているサーバーインスタンスを閉じ、デバッグサーバーを終了します。
     */
    public exit() {
        if (this.server === null) {
            return;
        }
        this.win.close();
        this.server.close();
        this.server = null;
    }

    private static makePageGeneratorConfig(mapdataFilename: string) {
        return {
            page: {
                additionalCssFiles: [
                    // TODO: オフラインで使用できないので @wwawing/all などから取得するようにする
                    "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/style.css"
                ]
            },
            wwa: {
                resources: {
                    mapData: mapdataFilename,
                    wwaJs: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.js",
                    wwaCss: "https://unpkg.com/@wwawing/all/dist/wwawing-dist/mapdata/wwa.css"
                }
            }
        };
    }
}
