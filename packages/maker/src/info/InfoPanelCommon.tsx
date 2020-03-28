import React from "react";
import styles from "./InfoPanelCommon.module.scss";

// InfoPanelCommon について
// InfoPanel では主に基本設定の編集やパーツの編集といった、テキストフォームを主体にしたレイアウトが多くなります。
// こういった箇所が簡単に利用できるような共通コンポーネントをまとめたファイルになります。

/**
 * 左にラベル、右にフォームがあるテキストフォームです。
 */
export const RowForm: React.StatelessComponent<{
    label: string
}> = (props) => {
    return (
        <div className={styles.row}>
            <div className={styles.rowTitle}>{props.label}</div>
            <div className={styles.rowContetn}>{props.children}</div>
        </div>
    )
}

export const Grid: React.StatelessComponent<{}> = (props) => {
    return (
        <div className={styles.grid}>{props.children}</div>
    )
}

export const Cell: React.StatelessComponent<{}> = (props) => {
    return (
        <div>{props.children}</div>
    )
}

/**
 * OK/リセットボタンです。
 * @param props 
 */
export const SubmitForm: React.StatelessComponent<{
    onSubmitButtonClick: () => void,
    onResetButtonClick: () => void
}> = (props) => {
    return (
        <div className={styles.submitForm}>
            <div className={styles.submitFormButtonContainer}>
                <button
                    className={styles.submitFormButton}
                    onClick={props.onSubmitButtonClick}
                >
                    OK
                </button>
            </div>
            <div className={styles.submitFormButtonContainer}>
                <button
                    className={styles.submitFormButton}
                    onClick={props.onResetButtonClick}
                >
                    リセット
                </button>
            </div>
        </div>
    )
}
