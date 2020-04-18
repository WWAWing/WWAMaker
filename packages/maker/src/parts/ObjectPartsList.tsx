import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../common/PartsList';
import { connect } from 'react-redux';
import { selectObjParts } from './PartsState';
import { Dispatch } from 'redux';
import PartsListFooter from '../common/PartsListFooter';
import { showPartsEdit } from "../info/InfoPanelState";
import { PartsType } from '../classes/WWAData';

interface Props {
    objectAttribute: number[][];
    selectPartsNumber: number;
    image: CanvasImageSource;
    selectObjParts: (partsNumber: number) => void;
    showPartsEdit: (partsNumber: number) => void;
}

/**
 * @todo 物体パーツ一覧と背景パーツ一覧を共通運用する SelectPartsList コンポーネントを作る
 */
class ObjectPartsList extends React.Component<Props> {
    private clickPartsChip(partsNumber: number) {
        this.props.selectObjParts(partsNumber);
    }

    private clickEditButton(partsNumber: number) {
        this.props.showPartsEdit(partsNumber);
    }

    public render() {
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>物体パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.objectAttribute}
                        selectParts={this.props.selectPartsNumber}
                        image={this.props.image}
                        onClick={(partsNumber: number) => { this.clickPartsChip(partsNumber) }}
                    ></PartsList>
                </div>
                <PartsListFooter
                    selectPartsNumber={this.props.selectPartsNumber}
                    onEditParts={() => { this.clickEditButton(this.props.selectPartsNumber) }}
                    onDeleteParts={() => {}}
                ></PartsListFooter>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        selectObjParts: (partsNumber: number) => {
            dispatch(selectObjParts({ number: partsNumber }));
        },
        showPartsEdit: (partsNumber: number) => {
            dispatch(showPartsEdit({ number: partsNumber, type: PartsType.OBJECT }));
        }
    };
}

export default connect(null, mapDispatchToProps)(ObjectPartsList);