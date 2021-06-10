import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * @todo enum から type に変えたい
 */
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

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        editMode: EditMode.PUT_MAP,
        currentPos: undefined,
        showGrid: true
    } as MapState,
    reducers: {
        /**
         * 編集モードを変更します。
         */
        setEditMode(state, action: PayloadAction<EditMode>) {
            state.editMode = action.payload;
        },
        /**
         * 現在のマウス位置を変更します。
         */
        setCurrentPos(state, action: PayloadAction<{ chipX: number, chipY: number }>) {
            state.currentPos = {
                chipX: action.payload.chipX,
                chipY: action.payload.chipY
            };
        },
        /**
         * グリッドの表示を切り替えます。
         */
        toggleGrid(state) {
            state.showGrid = !state.showGrid;
        }
    }
});

export const { setEditMode, setCurrentPos, toggleGrid } = mapSlice.actions;
export const mapReducer = mapSlice.reducer;
