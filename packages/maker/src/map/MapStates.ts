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
    editMode: EditMode;
}

export const INITIAL_STATE: MapState = {
    editMode: EditMode.PUT_MAP
};

const actionCreator = actionCreatorFactory();
/**
 * 編集モードを変更します。
 */
export const setEditMode = actionCreator<{ editMode: EditMode }>("SET_EDIT_MODE");

export const MapReducer = reducerWithInitialState(INITIAL_STATE)
    .case(setEditMode, (state, payload) => ({
        ...state,
        editMode: payload.editMode
    }));
