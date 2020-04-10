// 相対指定の値を表す型やメソッドを含めたファイルです。
// TODO: テストを実装したい
// TODO: WWA Wing と共用するために別パッケージの切り出しを考える

/**
 * 相対値の型情報です。
 */
export type RelativeValue = {
    type: "ABSOLUTE" | "RELATIVE_PLUS" | "RELATIVE_MINUS" | "PLAYER",
    value: number
} | {
    type: "PLAYER"
};

/**
 * 座標の値から相対値に変換します。
 * @param coordValue 
 */
export function convertRelativeValueFromCoord(coordValue: number): RelativeValue {
    // 9000 以降は相対値とします。
    if (coordValue >= 9000) {
        if (coordValue >= 10000) {
            return {
                type: "RELATIVE_PLUS",
                value: coordValue - 10000
            };
        } else if (coordValue < 10000) {
            return {
                type: "RELATIVE_MINUS",
                value: Math.abs(coordValue - 10000)
            };
        }

        return {
            type: "PLAYER"
        };
    }

    return {
        type: "ABSOLUTE",
        value: coordValue
    };
}

/**
 * WWAData の値から相対値に変換します。
 * @param statusValue 
 */
export function convertRelativeValueFromStatus(statusValue: number): number {
    if (statusValue > 30000) {
        return (statusValue - 30000) * -1;
    }

    return statusValue;
}
