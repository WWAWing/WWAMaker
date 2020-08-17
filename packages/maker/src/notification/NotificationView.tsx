import React from "react";

import { NotificationItem } from "./NotificationItem";
import styles from "./NotificationView.module.scss";
import { useSelector } from "react-redux";
import { NotificationItemView } from "./NotificationItem";
import { ErrorNotification } from "./types/ErrorNotification";

const NotificationView: React.FC<{}> = () => {
    const notificationItems = useSelector(state => state.notification.items);

    return (
        <div className={styles.notificationView}>
            {notificationItems.map(notificationItem => {
                const NotificationItemComponent = NotificationItemViewTable[notificationItem.type];
                return (
                    <NotificationItemComponent />
                )
            })}
        </div>
    );
};

const NotificationItemViewTable: { [type in NotificationItem["type"] ]: NotificationItemView } = {
    "ERROR": ErrorNotification
}

export default NotificationView;
