import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";

/**
 * 与えられたパーツ属性を元に、使用されているパーツの数を求めます。
 * @param partsAttribute 対象の各パーツ属性の配列
 * @returns 使用されているパーツの総数
 */
export default function getPartsCount(partsAttribute: WWAData["objectAttribute"] | WWAData["mapAttribute"]): number {
    const maxCount = Math.min(partsAttribute.length, WWAConsts.PARTS_NUMBER_MAX);

    // WWA は 一番最後のパーツの番号が 200 や 300 ではなく、 199 といった 1 を引いた値になっています。
    // その形に従うため、 maxCount から 1 を引いた状態からパーツ数チェックを始めます。
    for (let index = maxCount - 1; index > 0; index--) {
        if (partsAttribute[index][WWAConsts.ATR_0] !== 0) {
            // パーツ数は 0番 も含めた値になるのでその分含めて 1 を足す
            return index + 1;
        }
    }

    return 1;
}
