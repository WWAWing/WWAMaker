import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";

/**
 * Parts モジュールのステートについて
 *     Parts ステートはパーツ一覧画面の状態を表しています。
 *     どのパーツを選択しているか情報が記載されています。
 *     絞り込み操作といった、コンポーネント内で完結するステートについては、このステートには含まれていません。
 *     物体パーツも背景パーツも同じこのステートを用います。
 */
export interface PartsState {
    number: Number
}

const actionCreator = actionCreatorFactory();

/**
 * 指定したパーツを選択します。
 */
const selectParts = actionCreator<{ number: Number }>("SELECT_PARTS");

export const INITIAL_STATE: PartsState = {
    number: 0
}

export const PartsReducer = reducerWithInitialState(INITIAL_STATE)
    .case(selectParts, (state, { number }) => ({
        number: number
    }))
