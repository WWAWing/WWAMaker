import { WWAData } from "@wwawing/common-interface";
import clean from "./cleaner";
import press from "./presser";
import append from "./appender";
import { WWAConsts } from "./utils/wwa_data";

/**
 * WWA Saver のメインメソッドです。
 * @param wwaData 
 * @todo WWADataArray を press から append までをすべて扱う形に変更したい
 */
async function Saver(wwaData: WWAData): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {

        // 1. 不要なメッセージや属性値を削除
        const cleanedWWAData = clean(wwaData);

        // 2. データから8ビット空間配列を作成
        const wwaDataArray = press(cleanedWWAData);

        // 3. 8ビット空間配列を圧縮
        const lastIndex = wwaDataArray.compress();
        wwaDataArray.setCurrentIndex(lastIndex);

        // 4. テキストデータを付与
        append(wwaDataArray, cleanedWWAData);

        if (wwaDataArray.getLength() > WWAConsts.FILE_DATA_MAX) {
            reject("マップデータの総容量が許容値を超えています。");
        }

        resolve(wwaDataArray.getArray());
    });
}

export default Saver;
