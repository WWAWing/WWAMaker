import { NotificationItem } from "./NotificationItem";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";

export type NotificationState = {
    items: NotificationItem[]
};

export const INITIAL_STATE: NotificationState = {
    items: []
};

const actionCreator = actionCreatorFactory();
/**
 * 通知を発生させます。
 */
export const notify = actionCreator<{ content: NotificationItem }>("SHOW_ERROR");

export const NotificationReducer = reducerWithInitialState<NotificationState>(INITIAL_STATE)
    .case(notify, (state, params) => {
        const newState = Object.assign({}, state);
        newState.items = state.items.slice();
        newState.items.push(params.content);

        return newState;
    })
