import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";

export type ModalState = {
    type: "NONE"
} | {
    type: "ERROR",
    message: string
};

export const INITIAL_STATE: ModalState = {
    type: "NONE"
};

const actionCreator = actionCreatorFactory();
/**
 * エラーを発生させます。
 */
export const showError = actionCreator<{ errorMessage: string }>("SHOW_ERROR");

export const ModalReducer = reducerWithInitialState<ModalState>(INITIAL_STATE)
    .case(showError, (state, params) => ({
        ...state,
        type: "ERROR",
        message: params.errorMessage
    }))
