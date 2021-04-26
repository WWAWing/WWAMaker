import React from "react";
import { Message } from "semantic-ui-react";
import { notify } from "../NotificationStates";
import { NotificationItemView } from "../NotificationItem";

export type ErrorNotificationState = {
    type: "ERROR",
    message: string
};

/**
 * エラーを発生させます。
 * @param message エラーメッセージ
 */
export const showError = (message: string) => {
    notify({
        content: {
            type: "ERROR",
            message
        }
    });
};

export const ErrorNotification: NotificationItemView = () => {
    return (
        <Message negative>
            <Message.Header>エラー！</Message.Header>
            {/*<p>{message}</p>*/}
        </Message>
    );
};
