import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState, Handler } from "typescript-fsa-reducers";

/**
 * Parts モジュールのステートについて
 *     Parts ステートはパーツ一覧画面の状態を表しています。
 *     どのパーツを選択しているか情報が記載されています。
 *     絞り込み操作といった、コンポーネント内で完結するステートについては、このステートには含まれていません。
 *     物体パーツも背景パーツも同じこのステートを用います。
 */
export interface PartsState {
    number: number
}

const actionCreator = actionCreatorFactory();

/**
 * 指定したパーツを選択します。
 *     物体パーツと背景パーツで共通のため、アクションクリエイターを作るメソッドを予め用意しておきます。
 */
const selectPartsCreator = (name: string) => actionCreator<{ number: number }>(`SELECT_${name}_PARTS`);
export const selectObjParts = selectPartsCreator("OBJECT");
export const selectMapParts = selectPartsCreator("MAP");

export const INITIAL_STATE: PartsState = {
    number: 0
}

/**
 * パーツ選択に対応した Reducer です。
 * @param state 
 * @param param1 
 */
const selectPartsReducer: Handler<PartsState, PartsState, { number: number }> = (state, { number }) => ({
    ...state,
    number: number
});

export const ObjectPartsReducer = reducerWithInitialState(INITIAL_STATE)
    .case(selectObjParts, selectPartsReducer)

export const MapPartsReducer = reducerWithInitialState(INITIAL_STATE)
    .case(selectMapParts, selectPartsReducer)
