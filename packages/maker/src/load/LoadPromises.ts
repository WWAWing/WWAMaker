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
