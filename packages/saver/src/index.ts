import { WWAData } from "@wwawing/common-interface";
import clean from "./cleaner";
import press from "./presser";

async function Saver(wwaData: WWAData): Promise<Uint8ClampedArray> {
    return new Promise((resolve, reject) => {

        // 1. 不要なメッセージや属性値を削除
        const cleanedWWAData = clean(wwaData);

        // 2. データから8ビット空間配列を作成
        const pressedWWADataArray = press(cleanedWWAData);

        resolve(pressedWWADataArray);
    });
}

export default Saver;
