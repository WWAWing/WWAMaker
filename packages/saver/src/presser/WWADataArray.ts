/**
 * 8ビット配列空間を持つクラスです。
 */
export default class WWADataArray {
    private array: Uint8ClampedArray;
    /**
     * set*ByteNumber で index を指定しなかった場合に使用するインデックスの値
     */
    private currentIndex: number;

    constructor(length: number) {
        this.array = new Uint8ClampedArray(length).fill(0, 0, length);
        this.currentIndex = 0;
    }

    /**
     * currentIndex の値を更新します。
     * @param index 
     */
    public setCurrentIndex(index: number) {
        this.currentIndex = index;
    }

    /**
     * 1ビット値の値を設定します。
     * @param value 値
     * @param index セットしたいインデックスの値
     */
    public set1ByteNumber(value: number, index: number = this.currentIndex) {
        this.array[index] = value;
        if (index === this.currentIndex) {
            this.currentIndex++;
        }
    }

    /**
     * 2ビット値の値を設定します。
     * @param value 値
     * @param index セットしたいインデックスの1ビット目の値
     */
    public set2ByteNumber(value: number, index: number = this.currentIndex) {
        this.array[index] = value;
        this.array[index + 1] = value >> 8;
        if (index === this.currentIndex) {
            this.currentIndex += 2;
        }
    }

    /**
     * マップデータの整合性を確かめるための値を取得します。
     * @param start 
     */
    public getCheckData(start: number): number {
        const targetData = this.array.slice(start);
        const checkData = targetData.reduce((previousValue, currentValue, currentIndex) => {
            const shiftedIndex = start + currentIndex;
            // TODO: 8 と 1 の意味を調べる
            return previousValue + (currentValue * (shiftedIndex % 8 + 1));
        }, 0);

        return checkData;
    }

    /**
     * 配列空間を出力します。
     * @todo 圧縮処理も含めたい
     */
    public getArray() {
        return this.array;
    }

    /**
     * 配列空間の長さを出力します。
     */
    public getLength() {
        return this.array.length;
    }
}
