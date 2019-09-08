import React from 'react';
import styles from './PartsListFooter.module.scss';

interface Props {
    selectPartsNumber: number;
    onEditParts: () => void;
    onDeleteParts: () => void;
}

const PartsListFooter: React.SFC<Props> = props => {
    return (
        <footer className={styles.listFooter}>
            <div className={styles.listFooterInfo}>
                選択パーツ: {props.selectPartsNumber}
            </div>
            <div className={styles.listFooterControl}>
                <button onClick={props.onEditParts}>選択パーツ編集</button>
                <button onClick={props.onDeleteParts}>選択パーツ削除</button>
            </div>
        </footer>
    );
};

export default PartsListFooter;
