import fs from 'fs';

/**
 * 画像ファイルを読み込み、データ形式の文字列で返します。
 * 画像ファイルの読み込みには Node.js の fs モジュールを使用しています。
 * 返される結果はその読み込み結果から、 HTML の img.src で指定できるように、文字列形式で返却します。
 * @param imageFilePath 読み込みたい画像のファイル
 * @returns HTML の img.src で指定可能な文字列形式の画像データを含む Promise
 *     (エラー発生時は NodeJS の fs.readFile のエラーとともに reject)
 */
export default function loadImage(imageFilePath: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {
        fs.readFile(imageFilePath, {}, (err, data) => {
            if (err) {
                reject(err);
            }
            // TODO: Blob 形式や data:url 形式に変換したい
            resolve(data.toString());
        });
    });

}
