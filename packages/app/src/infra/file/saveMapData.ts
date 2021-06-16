import { WWAData } from "@wwawing/common-interface";
import Saver from "wwamaker-saver";
import fs from "fs";

/**
 * WWA のデータから Saver を呼び出し、ファイルを保存します。
 * @param wwaData WWA データ
 * @returns マップデータファイルの Blob
 */
export default async function save(filePath: string, wwaData: WWAData, callback: fs.NoParamCallback) {
    // FIXME: ESModules の Saver を使用している
    const data = await Saver(wwaData);
    fs.writeFile(filePath, data, callback);
}
