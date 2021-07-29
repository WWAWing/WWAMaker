import { WWAConsts } from "./wwa_data";

/**
 * 8ビット配列空間を持つクラスです。
 */
export default class WWADataArray {
    /**
     * 8ビット配列本体
     *     通常は FILE_DATA_MAX の長さを持つため、そのまま出力すると非常に長いデータを持ちます。
     *     そのため、どこまで使われているかを後述の lastIndex で管理しています。
     */
    private array: Uint8Array;

    /**
     * set*ByteNumber で index を指定しなかった場合に使用するインデックスの値
     */
    private currentIndex: number;

    /**
     * 最後の項目の末尾の index
     *     getArray 実行時に lastIndex までの項目を取り出して出力します。
     *     **最後の項目** の index ではありません
     */
    private lastIndex: number;

    constructor() {
        this.array = new Uint8Array(WWAConsts.FILE_DATA_MAX);
        this.currentIndex = 0;
        this.lastIndex = 0;
    }

    /**
     * currentIndex の値を更新します。
     * @param index 
     */
    public setCurrentIndex(index: number) {
        this.currentIndex = index;
    }

    /**
     * lastIndex を設定します。ただし、 lastIndex の値が既に大きい場合は何も変化しません。
     * @param index 
     */
    private setLastIndex(index: number) {
        this.lastIndex = Math.max(index, this.lastIndex);
    }

    /**
     * lastIndex を既存の値に関係なく強制的に設定します。
     * @param index 
     */
    private setLastIndexForce(index: number) {
        this.lastIndex = index;
    }

    /**
     * 1バイト値の値を設定します。
     * @param value 値
     * @param index セットしたいインデックスの値
     */
    public set1ByteNumber(value: number, index: number = this.currentIndex) {
        this.array[index] = value;
        this.setLastIndex(index + 1);
        if (index === this.currentIndex) {
            this.currentIndex++;
        }
    }

    /**
     * 2バイト値の値を設定します。上位バイトの値を次のバイトにセットするリトルエンディアン方式を使用しています。
     * @param value 値
     * @param index セットしたいインデックスの1ビット目の値
     */
    public set2ByteNumber(value: number, index: number = this.currentIndex) {
        this.array[index] = value;
        this.array[index + 1] = value >> 8;
        this.setLastIndex(index + 2);
        if (index === this.currentIndex) {
            this.currentIndex += 2;
        }
    }

    /**
     * 文字列の値を設定します。配置される位置は currentIndex の値の従います。
     * @param value 
     */
    public setString(value: string) {
        const valueCodes = value.split("").reduce((previousCodes: number[], currentChar) => {
            return previousCodes.concat(currentChar.charCodeAt(0), currentChar.charCodeAt(0) >> 8)
        }, []).concat(0, 0);
        this.array.set(valueCodes, this.currentIndex);
        this.currentIndex += valueCodes.length;
        this.setLastIndex(this.currentIndex);
    }

    /**
     * マップデータの整合性を確かめるための値を取得します。
     * @param start 
     */
    public getCheckData(start: number): number {

        /**
         * 8ビット値の値に対して符号を与えます。
         *     WWA Loader の utils からそのまま持ってきています。
         * @param b 
         * @see https://github.com/WWAWing/WWAWing/blob/develop/packages/loader/src/infra/util.ts
         */
        const signedByte = (b: number): number => {
            b = b % 0x100;
            return b >= 0x80 ? b - 0x100 : b;
        };
  
        const targetData = this.array.slice(start, this.lastIndex);
        const checkData = targetData.reduce((previousValue, currentValue, currentIndex) => {
            const shiftedIndex = start + currentIndex;
            return previousValue + (signedByte(currentValue) * (shiftedIndex % 8 + 1));
        }, 0);

        return checkData % 0x10000;
    }

    /**
     * 数字値を圧縮します。
     *     WWAマップ作成ツールの圧縮処理をそのまま引っ張っています。
     * @returns 圧縮後の末尾の位置
     * @todo 近いうちにリファクタリングする
     */
    public compress(): number {
        let compressedData = new Uint8Array(WWAConsts.FILE_DATA_MAX);

        let j = 0;
        for (let i = 0, counter = 0; i < this.lastIndex; ++i){
            /**
             * 数字値の圧縮は、同じ値が連続で続いた場合に、「値」「値」「回数」の配列に書き換える方法で実現しています。
             *     ループの中で値が連続していると判断されると、 counter の値の計算を始めます。
             *     途中で違う値が検出されたり、16回分続いたりした場合は counter の計算を終わらせ、圧縮した値を書き出すことで圧縮が終わります。
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
        this.setLastIndexForce(j + 3);
        return j + 3;
    }

    /**
     * 配列空間を出力します。
     */
    public getArray() {
        return this.array.slice(0, this.lastIndex);
    }

    /**
     * 配列空間の長さを出力します。
     */
    public getLength() {
        return this.lastIndex;
    }
}
