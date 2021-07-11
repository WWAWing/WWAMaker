import fsPromises from 'fs/promises';

/**
 * 画像ファイルを読み込み、 Buffer 形式で返します。
 * 画像ファイルの読み込みには Node.js の fs/promises モジュールを使用して、結果をそのまま返しています。
 * @param imageFilePath 読み込みたい画像のファイル
 * @returns 画像の Buffer の Promise
 *     (エラー発生時は NodeJS の fs.readFile のエラーとともに reject)
 */
export default function loadImage(imageFilePath: string): Promise<Buffer> {
    return fsPromises.readFile(imageFilePath);
}
