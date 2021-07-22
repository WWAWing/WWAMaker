import { WWAData } from "@wwawing/common-interface";
import { Server } from "http";
import express from "express";
import path from "path";
import { render } from "@wwawing/page-generator";
import Saver from "wwamaker-saver";

/**
 * WWA Maker のテストプレイデバッグサーバーです。
 * テストプレイを行うと、内部で express を起動し、マップデータのあるディレクトリを参照します。
 */
export default class WWAMakerDebugServer {

    private server: Server | null;

    private static DEBUG_SERVER_PORT = 3311;

    constructor() {
        this.server = null;
    }

    /**
     * デバッグサーバーを起動し、 Node のサーバーインスタンスを内部に格納します。
     * @param wwaData WWA のマップデータオブジェクト
     * @param absolutePath WWA のマップデータファイルへの絶対 Path
     * @returns サーバーインスタンスを返り値に取る Promise
     */
    public launch(wwaData: WWAData, absolutePath: string): Promise<Server> {
        return new Promise((resolve, reject) => {
            if (this.server !== null) {
                reject("すでにサーバーが起動しています。再度起動したい場合はもう一度閉じる必要があります。");
            }
            
            const expressApp = express();
            const dirPath = path.dirname(absolutePath);
            const mapdataFilename = path.basename(absolutePath);

            expressApp.get("/", (req, res) => {
                res.send(render(WWAMakerDebugServer.makePageGeneratorConfig(mapdataFilename)));
            });

            expressApp.get("/" + mapdataFilename, (req, res) => {
                res.set('Content-Type', 'application/octet-stream');
                Saver(wwaData).then(value => {
                    res.send(Buffer.from(value));
                });
            });

            expressApp.use("/", express.static(dirPath));

            this.server = expressApp.listen(WWAMakerDebugServer.DEBUG_SERVER_PORT, () => {
                if (this.server === null) {
                    reject("サーバーの起動に失敗しました。");
                } else {
                    resolve(this.server);
                }
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
