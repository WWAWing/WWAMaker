import { reducerWithInitialState } from "typescript-fsa-reducers";
import { defaultWWAData, PartsType } from "../classes/WWAData";
import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();
/**
 * パーツを配置します。
 */
export const putParts = actionCreator<{
    x: number,
    y: number,
    width: number,
    height: number,
    partsType: PartsType,
    partsNumber: number
}>("PUT_PARTS");

/**
 * 配列 target から指定した場所に番号を敷き詰めます。
 * @param target 
 * @param value
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 */
const fillParts = (
    target: number[][],
    value: number,
    x: number,
    y: number,
    width: number,
    height: number
): number[][] => {
    return target.map((line, lineIndex) => {
        if (lineIndex < y || lineIndex >= y + height) {
            return line;
        }
        return line.fill(value, x, x + width);
    });
}

export const WWADataReducer = reducerWithInitialState(defaultWWAData)
    .case(putParts, (state, payload) => {
        const newState = Object.assign({}, state);
        switch (payload.partsType) {
            case PartsType.MAP:
                newState.map = fillParts(newState.map, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
                break;
            case PartsType.OBJECT:
                newState.mapObject = fillParts(newState.mapObject, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
        }
        return newState;
    })
