import React from "react";
import { ErrorNotificationState } from "./types/ErrorNotification";

/**
 * 通知で表示するアイテムです。
 */
export type NotificationItem = ErrorNotificationState;

/**
 * types ディレクトリ以降の各通知の内容表示コンポーネントを定義づける型情報です。
 * @todo 各通知固有のパラメーターをもたせる場合、どうしたら良いか考える
 */
export type NotificationItemView = React.FC<{

}>;
