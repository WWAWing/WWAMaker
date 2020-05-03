import actionCreatorFactory from "typescript-fsa"
import { reducerWithInitialState } from "typescript-fsa-reducers";

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
    }
}

export const INITIAL_STATE: MapState = {
    editMode: EditMode.PUT_MAP,
    currentPos: undefined
};

const actionCreator = actionCreatorFactory();
/**
 * 編集モードを変更します。
 */
export const setEditMode = actionCreator<{ editMode: EditMode }>("SET_EDIT_MODE");
/**
 * 現在のマウス位置を変更します。
 */
export const setCurrentPos = actionCreator<{ chipX: number, chipY: number }>("SET_CURRENT_POS");

export const MapReducer = reducerWithInitialState(INITIAL_STATE)
    .case(setEditMode, (state, payload) => ({
        ...state,
        editMode: payload.editMode
    }))
    .case(setCurrentPos, (state, payload) => ({
        ...state,
        currentPos: {
            chipX: payload.chipX,
            chipY: payload.chipY
        }
    }));
