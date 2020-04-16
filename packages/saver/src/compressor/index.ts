import { WWAConsts } from "../utils/wwa_data";

/**
 * 8ビット配列を圧縮します。
 *     ソースコードはWWAマップ作成ツールのものをそのまま持ってきています。
 * @todo 近いうちにリファクタリングする
 */
export default function compress(array: Uint8ClampedArray): Uint8ClampedArray {
    let compressedData = new Uint8ClampedArray(WWAConsts.FILE_DATA_MAX);

    let j = 0;
    for (let i = 0, counter = 0; i < array.length; ++i){
        if (array[i] == array[i + 1]){
            ++counter;
            if ( (counter == 0xff) || (i + 2 > array.length) ){
                compressedData[j] = array[i];
                compressedData[j+1] = array[i];
                compressedData[j+2] = counter;
                j += 3;
                ++i;
                counter = 0;
            }
        } else {
            if (counter == 0){
                compressedData[j] = array[i];
                ++j;
            } else {
                compressedData[j] = array[i];
                compressedData[j+1] = array[i];
                compressedData[j+2] = counter;
                j += 3;
            }
            counter = 0;
        }
    }
    compressedData[j] = 0;
    compressedData[j + 1] = 0;
    compressedData[j + 2] = 0;

    return compressedData;
}
