import WWAConsts from "../classes/WWAConsts";

// 相対指定の値を表す型やメソッドを含めたファイルです。
// TODO: テストを実装したい
// TODO: WWA Wing と共用するために別パッケージの切り出しを考える

/**
 * 相対値の型情報です。
 */
export type RelativeValue =
    | RelativeAbsoluteValue
    | RelativeRelativeValue
    | RelativePlayerValue;

export type RelativeAbsoluteValue = {
    type: "ABSOLUTE",
    value: number
};

export type RelativeRelativeValue = {
    type: "RELATIVE",
    value: number
};

export type RelativePlayerValue = {
    type: "PLAYER"
};

/**
 * 座標の値から相対値に変換します。
 * @param coordValue 
 */
export function convertRelativeValueFromCoord(coordValue: number): RelativeValue {

    if (coordValue >= WWAConsts.RELATIVE_COORD_LOWER) {
        if (coordValue === WWAConsts.PLAYER_COORD) {
            return {
                type: "PLAYER"
            };
        }

        return {
            type: "RELATIVE",
            value: coordValue - WWAConsts.RELATIVE_COORD_BIAS
        };
    }

    return {
        type: "ABSOLUTE",
        value: coordValue
    };
}

/**
 * RelativeValue から WWAData で使用する値に変換します。
 */
export function convertDataValueFromRelativeCoord(value: RelativeValue): number {
    if (value.type === "PLAYER") {
        return WWAConsts.PLAYER_COORD;
    }

    if (value.type === "RELATIVE") {
        return value.value + WWAConsts.RELATIVE_COORD_BIAS;
    }

    return value.value;
}

/**
 * WWAData のステータス値から相対値に変換します。
 * @param statusValue 
 */
export function convertRelativeValueFromStatus(statusValue: number): number {
    if (statusValue > WWAConsts.STATUS_MINUS_BORDER) {
        return (statusValue - WWAConsts.STATUS_MINUS_BORDER) * -1;
    }

    return statusValue;
}

/**
 * 相対値から WWAData のステータス値に変換します。
 * @param relativeValue 
 */
export function convertDataValueFromRelativeStatus(relativeValue: number): number {
    if (relativeValue < 0) {
        return Math.abs(relativeValue) + WWAConsts.STATUS_MINUS_BORDER;
    }

    return relativeValue;
}
