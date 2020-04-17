import { WWAConsts } from "./wwa_data";

/**
 * 8ビット配列空間を持つクラスです。
 */
export default class WWADataArray {
    private array: Uint8Array;
    /**
     * set*ByteNumber で index を指定しなかった場合に使用するインデックスの値
     */
    private currentIndex: number;

    constructor(length: number) {
        this.array = new Uint8Array(length);
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
     * 文字列の値を設定します。
     * @param value 
     * @todo 日本語といったマルチバイト文字については予期しない処理を起こすかもしれないので気を付ける
     */
    public setString(value: string) {
        const valueCodes = value.split("").reduce((previousCodes: number[], currentChar) => {
            return previousCodes.concat(currentChar.charCodeAt(0), currentChar.charCodeAt(0) >> 8)
        }, []).concat(0, 0);
        this.array.set(valueCodes, this.currentIndex);
        this.currentIndex += valueCodes.length;
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

        return checkData % 0x10000;
    }

    /**
     * 数字値を圧縮します。
     * @returns 圧縮後の末尾の位置
     * @todo 近いうちにリファクタリングする
     */
    public compress(): number {
        let compressedData = new Uint8Array(WWAConsts.FILE_DATA_MAX);

        let j = 0;
        for (let i = 0, counter = 0; i < this.array.length; ++i){
            /**
             * 数字値の圧縮は、同じ値が連続で続いた場合に、「値」「値」「回数」の配列に書き換える方法で実現している。
             *     ループの中で値が連続していると判断されると、 counter の値の計算を始める。
             *     途中で違う値が検出されたり、16回分続いたりした場合は counter の計算を終わらせ、圧縮した値を書き足す。
             */
            if (this.array[i] == this.array[i + 1]){
                ++counter;
                if ( (counter == 0xff) || (i + 2 > this.array.length) ){
                    compressedData[j] = this.array[i];
                    compressedData[j + 1] = this.array[i];
                    compressedData[j + 2] = counter;
                    j += 3;
                    ++i;
                    counter = 0;
                }
            } else {
                if (counter == 0){
                    compressedData[j] = this.array[i];
                    ++j;
                } else {
                    compressedData[j] = this.array[i];
                    compressedData[j + 1] = this.array[i];
                    compressedData[j + 2] = counter;
                    j += 3;
                }
                counter = 0;
            }
        }
        compressedData[j] = 0;
        compressedData[j + 1] = 0;
        compressedData[j + 2] = 0;

        this.array = compressedData;
        return j + 3;
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
