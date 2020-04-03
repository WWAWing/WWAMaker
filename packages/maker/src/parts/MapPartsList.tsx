import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../common/PartsList';
import { connect } from 'react-redux';
import { selectMapParts } from './PartsState';
import { Dispatch } from 'redux';
import PartsListFooter from '../common/PartsListFooter';
import { showPartsEdit } from '../info/InfoPanelState';
import { PartsType } from '../classes/WWAData';

interface Props {
    mapAttribute: number[][];
    selectPartsNumber: number;
    image: CanvasImageSource;
    selectMapParts: (partsNumber: number) => void;
    showPartsEdit: (partsNUmber: number) => void;
}

class MapPartsList extends React.Component<Props> {
    private clickPartsChip(partsNumber: number) {
        this.props.selectMapParts(partsNumber);
    }

    private clickEditButton(partsNumber: number) {
        this.props.showPartsEdit(partsNumber);
    }

    public render() {
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>背景パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.mapAttribute}
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
        selectMapParts: (partsNumber: number) => {
            dispatch(selectMapParts({ number: partsNumber }));
        },
        showPartsEdit: (partsNumber: number) => {
            dispatch(showPartsEdit({ number: partsNumber, type: PartsType.MAP }));
        }
    };
}

export default connect(null, mapDispatchToProps)(MapPartsList);
