import { CaseReducer, createAction, createReducer } from "@reduxjs/toolkit";

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

export type PartsSelectPayload = {
    number: number
};

/**
 * 指定したパーツを選択します。
 *     物体パーツと背景パーツで共通のため、アクションクリエイターを作るメソッドを予め用意しておきます。
 */
const createSelectPartsAction = (name: string) => {
    return createAction<PartsSelectPayload>(`SELECT_${name}_PARTS`);
}

export const selectObjParts = createSelectPartsAction("OBJECT");
export const selectMapParts = createSelectPartsAction("MAP");

export const INITIAL_STATE: PartsState = {
    number: 0
}

/**
 * パーツ選択に対応した Reducer です。
 * @param state 
 * @param param1 
 */
const selectPartsReducer: CaseReducer<PartsState, { payload: PartsSelectPayload, type: string }> = (state, action) => ({
    ...state,
    number: action.payload.number
});

export const ObjectPartsReducer = createReducer(INITIAL_STATE, builder =>
    builder.addCase(selectObjParts, selectPartsReducer)
);

export const MapPartsReducer = createReducer(INITIAL_STATE, builder =>
    builder.addCase(selectMapParts, selectPartsReducer)
);
