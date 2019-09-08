import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../components/common/PartsList';
import { connect } from 'react-redux';
import { selectObjParts } from './PartsStates';
import { Dispatch } from 'redux';
import PartsListFooter from '../components/common/PartsListFooter';

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
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>物体パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.objectAttribute}
                        partsMax={this.props.objectPartsCount}
                        selectParts={this.props.selectPartsNumber}
                        image={this.props.image}
                        onClick={(partsNumber: number) => { this.clickPartsChip(partsNumber) }}
                    ></PartsList>
                </div>
                <PartsListFooter
                    selectPartsNumber={this.props.selectPartsNumber}
                    onEditParts={() => {}}
                    onDeleteParts={() => {}}
                ></PartsListFooter>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        selectObjParts: (partsNumber: number) => {
            dispatch(selectObjParts(partsNumber))
        }
    };
}

export default connect(null, mapDispatchToProps)(ObjectPartsList);