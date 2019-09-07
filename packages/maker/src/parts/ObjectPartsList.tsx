import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../components/common/PartsList';
import { connect } from 'react-redux';
import { selectObjParts } from './PartsStates';
import { Dispatch } from 'redux';

/**
 * @todo redux から接続出来るように実装する
 */
interface Props {
    objectAttribute: number[][];
    objectPartsCount: number;
    selectPartsNumber: number;
    image: CanvasImageSource;
    selectObjParts: (partsNumber: number) => void;
}

/**
 * @todo 物体パーツ一覧と背景パーツ一覧を共通運用する SelectPartsList コンポーネントを作る
 */
class ObjectPartsList extends React.Component<Props> {
    private clickPartsChip(partsNumber: number) {
        this.props.selectObjParts(partsNumber);
    }

    public render() {
        /**
         * @todo パーツ番号をどうやって引っ張るか考える
         */
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>物体パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.objectAttribute}
                        partsMax={this.props.objectPartsCount}
                        image={this.props.image}
                        onClick={(partsNumber: number) => { this.clickPartsChip(partsNumber) }}
                    ></PartsList>
                </div>
                <footer className={styles.toolPanelItemFooter}>
                    <div>選択パーツ: {this.props.selectPartsNumber}番</div>
                </footer>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        selectObjParts: (partsNumber: number) => {
            dispatch(selectObjParts({ selectPartsNumber: partsNumber }))
        }
    };
}

export default connect(null, mapDispatchToProps)(ObjectPartsList);
