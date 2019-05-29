import React from 'react';
import styles from './PartsList.module.scss';
import { LoadState } from '../../classes/Loader';
import PartsChip from './PartsChip';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    state: LoadState;
    attribute: number[][];
    image: CanvasImageSource;
}

export default class MapLayer extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        attribute: [],
        image: new Image()
    }

    /**
     * PartsChip を描画します。
     * @param {number} partsNumber パーツ番号
     * @returns {JSX.Element}
     */
    private renderPartsChip(partsNumber: number): JSX.Element {
        const cropX = this.props.attribute[partsNumber][WWAConsts.ATR_X];
        const cropY = this.props.attribute[partsNumber][WWAConsts.ATR_Y];
        return (
            <PartsChip
                image={this.props.image}
                cropX={cropX}
                cropY={cropY}
                onClick={() => {}}
            ></PartsChip>
        );
    }

    public render() {
        return (
            <div className={styles.partsList}>
                {this.props.attribute.map(
                    (partsAttribute, partsNumber) => this.renderPartsChip(partsNumber)
                )}
            </div>
        )
    }
}
