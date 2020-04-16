/**
 * 8ビット配列空間を持つクラスです。
 */
export default class WWADataArray {
    private array: Uint8ClampedArray;

    constructor() {
        this.array = new Uint8ClampedArray();
    }

    /**
     * 1ビット値の値を設定します。
     * @param index セットしたいインデックスの値
     * @param value 値
     */
    public set1ByteNumber(index: number, value: number) {
        this.array[index] = value;
    }

    /**
     * 2ビット値の値を設定します。
     * @param index セットしたいインデックスの1ビット目の値
     * @param value 値
     */
    public set2ByteNumber(index: number, value: number) {
        this.array[index] = value;
        this.array[index + 1] = value >> 8;
    }

    /**
     * 配列空間を出力します。
     * @todo 圧縮処理も含めたい
     */
    public getArray() {
        return this.array;
    }
}
