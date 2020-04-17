import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";

export default function getPartsCount(partsAttribute: WWAData["objectAttribute"] | WWAData["mapAttribute"]): number {
    const maxCount = Math.min(partsAttribute.length, WWAConsts.PARTS_NUMBER_MAX);

    for (let index = maxCount - 1; index > 0; index--) {
        if (partsAttribute[index][WWAConsts.ATR_0] !== 0) {
            return index;
        }
    }

    return 0;
}
