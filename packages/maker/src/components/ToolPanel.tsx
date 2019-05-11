import React from 'react';
import styles from './ToolPanel.module.scss';

/**
 * ToolPanel は画面下に配置されるパネルのことで、主にパーツ一覧ではこの ToolPanel から表示されます。
 * PartsListPanel としないのは、今後のバージョンアップで表示内容が変更されても、コンポーネント名を維持するためです。
 */
export default class ToolPanel extends React.Component {
    public render() {
        return (
            <div className={styles.ToolPanel}>
                <div className={styles.Left}>
                    物体パーツ一覧
                </div>
                <div className={styles.Right}>
                    背景パーツ一覧
                </div>
            </div>
        );
    }
}
