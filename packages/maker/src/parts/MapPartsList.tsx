import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../components/common/PartsList';
import { connect } from 'react-redux';
import { selectMapParts } from './PartsStates';
import { Dispatch } from 'redux';

interface Props {
    mapAttribute: number[][];
    mapPartsCount: number;
    selectPartsNumber: number;
    image: CanvasImageSource;
    selectMapParts: (partsNumber: number) => void;
}

class MapPartsList extends React.Component<Props> {
    private clickPartsChip(partsNumber: number) {
        this.props.selectMapParts(partsNumber);
    }

    public render() {
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>背景パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.mapAttribute}
                        partsMax={this.props.mapPartsCount}
                        selectParts={this.props.selectPartsNumber}
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
        selectMapParts: (partsNumber: number) => {
            dispatch(selectMapParts(partsNumber))
        }
    };
}

export default connect(null, mapDispatchToProps)(MapPartsList);
