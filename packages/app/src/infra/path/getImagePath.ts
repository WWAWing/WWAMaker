import path from 'path';

/**
 * 読み込む画像ファイルの Path を特定します。
 * filePath からファイル名の箇所を削除し、代わりに imageFilename を追記しています。
 * 
 * - filePath: /home/wwa/maker/mapdata/wwamap.dat
 * - imageFilename: mapcg.gif
 * - の場合、 /home/wwa/maker/mapdata/mapcg.gif が返ってきます
 * 
 * Path の区切り文字が / ではなく \ の場合、 \ のままで返ってきます。
 * @param filePath ファイルの絶対 Path (例えば開いているマップデータの Path)
 * @param imageFilename 画像ファイル名
 * @returns 
 */
export default function getImagePath(filePath: string, imageFilename: string): string {
    return path.dirname(filePath) + path.sep + imageFilename;
}
