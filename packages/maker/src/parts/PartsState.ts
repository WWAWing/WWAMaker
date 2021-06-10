import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
 * Redux の Slice を作成します。
 * 物体パーツと背景パーツで共通のため、アクションクリエイターを作るメソッドを予め用意しておきます。
 * @param name 物体なら "object", 背景なら "map"
 * @returns Redux の Slice
 */
export const makePartsSlice = (name: string) => {
    return createSlice({
        name: `${name}parts`,
        initialState: {
            number: 0
        } as PartsState,
        reducers: {
            /**
             * 指定したパーツを選択します。
             */
            selectParts(state, action: PayloadAction<PartsSelectPayload>) {
                state.number = action.payload.number;
            }
        }
    });
};

export const objectPartsSlice = makePartsSlice("object");
export const objectPartsReducer = objectPartsSlice.reducer;
export const objectselectParts = objectPartsSlice.actions.selectParts;

export const mapPartsSlice = makePartsSlice("map");
export const mapPartsReducer = mapPartsSlice.reducer;
export const mapselectParts = mapPartsSlice.actions.selectParts;
