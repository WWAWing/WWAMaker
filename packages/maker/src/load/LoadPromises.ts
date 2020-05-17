import { WWALoader, WWALoaderEventEmitter, Progress } from "@wwawing/loader";
import { BrowserEventEmitter } from "@wwawing/event-emitter";
import { WWAData } from "@wwawing/common-interface";

/**
 * WWA のマップデータを読み込む Promise です。
 *     WWALoader は Web Worker で呼び出す形となっています。
 *     Web Worker は Promise とはやり方が違うので、読み込み全体の Promise をこのメソッドでまかないます。
 *     Web Worker で発生する途中経過のメッセージについては、このメソッドに付いているコールバックメソッドを介して実行させます。
 * @param mapdataFileName マップデータのファイル名
 * @param progressCallbackFn message イベント発生時に呼び出すメソッド
 * @param errorCallbackFn エラー発生時で呼び出すメソッド
 */
export const loadWWADataPromise = (
    mapdataFileName: string,
    progressCallbackFn: (progress: Progress) => void
) => {
    return new Promise<WWAData>(function (resolve, reject) {

        const eventEmitter = new BrowserEventEmitter() as WWALoaderEventEmitter;
        const loader = new WWALoader(mapdataFileName, eventEmitter);

        const handleMapData = eventEmitter.addListener("mapData", wwaMap => {
            eventEmitter.removeListener("mapData", handleMapData);
            eventEmitter.removeListener("progress", handleProgress);
            eventEmitter.removeListener("error", handleError);
            resolve(wwaMap);
        });

        const handleProgress = eventEmitter.addListener("progress", progress => {
            progressCallbackFn(progress);
        });

        const handleError = eventEmitter.addListener("error", error => {
            reject(error);
        });

        loader.requestAndLoadMapData();
    });
}

/**
 * イメージ画像を読み込む Promise です。
 * @param imageFileName 
 */
export const loadImagePromise = (
    imageFileName: string
) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {

        const imageLoadHandler = () => {
            image.removeEventListener("load", imageLoadHandler);
            image.removeEventListener("error", imageErrorHandler);
            resolve(image);
        };

        const imageErrorHandler = (event: ErrorEvent) => {
            reject({
                title: 'Image Error',
                message: event.message
            });
        };

        const image = new Image();
        image.addEventListener("load", imageLoadHandler);
        image.addEventListener("error", imageErrorHandler);
        image.src = imageFileName;
    });
};

/**
 * 読み込んだイメージ画像を objectURL にエンコードする Promise です。
 * @param imageElement 
 */
export const encodeImagePromise = (
    imageElement: HTMLImageElement
) => {
    return new Promise<string>((resolve, reject) => {
        let canvasElement = document.createElement("canvas");
        canvasElement.width = imageElement.width;
        canvasElement.height = imageElement.height;

        const canvasContext = canvasElement.getContext("2d");
        if (canvasContext === null) {
            reject({
                title: "Image Error",
                message: "イメージのコンテキストの取得に失敗しました。"
            });
        } else {
            canvasContext.drawImage(imageElement, 0, 0);
        }

        canvasElement.toBlob((blob) => {
            if (blob === null) {
                return;
            }
            resolve(URL.createObjectURL(blob));
        }, "image/gif");
    });
};
