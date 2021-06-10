import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";

export enum EditMode {
    PUT_MAP = 1,
    PUT_OBJECT = 2,
    EDIT_MAP = 3,
    EDIT_OBJECT = 4,
    DELETE_OBJECT = 5
}

export interface MapState {
    /**
     * 編集モードはマップ編集で使用するモードを表します。
     *     WWA は物体パーツと背景パーツの2層でマップを表現しているため、物体パーツを置くか、背景パーツを置くか識別する必要があります。
     *     物体パーツと背景パーツそれぞれの配置と編集を加えています。
     */
    editMode: EditMode;
    /**
     * 現在のマウスの位置を表します。
     *     マス単位で表示されていて、主にツールバーの表示に使用されています。
     */
    currentPos?: {
        chipX: number,
        chipY: number
    };
    showGrid: boolean;
}

export const INITIAL_STATE: MapState = {
    editMode: EditMode.PUT_MAP,
    currentPos: undefined,
    showGrid: true
};

/**
 * 編集モードを変更します。
 */
export const setEditMode = createAction<{ editMode: EditMode }>("SET_EDIT_MODE");
/**
 * 現在のマウス位置を変更します。
 */
export const setCurrentPos = createAction<{ chipX: number, chipY: number }>("SET_CURRENT_POS");
/**
 * グリッドの表示を切り替えます。
 */
export const toggleGrid = createAction("TOGGLE_GRID");

export const MapReducer = createReducer(INITIAL_STATE, builder => {
    builder
        .addCase(setEditMode, (state, { payload }) => Object.assign(state, {
            editMode: payload.editMode
        }))
        .addCase(setCurrentPos, (state, { payload }) => Object.assign(state, {
            currentPos: {
                chipX: payload.chipX,
                chipY: payload.chipY
            }
        }))
        .addCase(toggleGrid, state => Object.assign(state, {
            showGrid: !state.showGrid
        }))
});
