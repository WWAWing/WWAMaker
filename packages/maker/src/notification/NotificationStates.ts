import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { ErrorNotificationState } from "./types/ErrorNotification";

export type NotificationState = {
    items: NotificationItem[]
};

/**
 * 通知で表示するアイテムです。
 */
type NotificationItem = ErrorNotificationState;

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
