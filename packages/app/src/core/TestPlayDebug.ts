import { WWAData } from "@wwawing/common-interface";
import { Server } from "http";
import express from "express";
import path from "path";
import { render } from "@wwawing/page-generator";
import Saver from "wwamaker-saver";

/**
 * WWA Maker のテストプレイ内部で動作しているデバッグサーバーを管理するクラスです。
 * テストプレイを行うと、内部で express を起動し、マップデータのあるディレクトリを参照します。
 */
export default class TestPlayDebug {

    private server: Server | null;

    private static DEBUG_SERVER_PORT = 3311;

    constructor() {
        this.server = null;
    }

    /**
     * デバッグサーバーを起動し、 Node のサーバーインスタンスを内部に格納します。
     * @param wwaData WWA のマップデータオブジェクト
     * @param absolutePath WWA のマップデータファイルへの絶対 Path
     * @returns WWA がプレイできる URL
     */
    public launch(wwaData: WWAData, absolutePath: string): string {
        const mapdataName = path.basename(absolutePath, ".dat");

        if (this.server === null) {
            const expressApp = express();
            const dirPath = path.dirname(absolutePath);
            const mapdataFilename = path.basename(absolutePath);

            // "/" だけの場合、どのマップデータも同じ URL でプレイすることになり、セーブデータが引き継げなくなる
            expressApp.get("/" + mapdataName, (req, res) => {
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

        if (this.server === null) {
            throw new Error("サーバーが起動していません。");
        }

        const address = this.server.address();
        if (address === null) {
            throw new Error("サーバーのアドレスの取得に失敗しました。");
        }

        // TODO: address が string 型の場合、 path モジュールを使用すると正常に URL として変換されないのではないか？
        return typeof address === "string"
            ? path.join(address, mapdataName)
            : `http://localhost:${address.port}/${mapdataName}`;
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
