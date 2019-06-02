import React from 'react';
import styles from './PartsList.module.scss';
import { LoadState } from '../../classes/Loader';
import PartsChip from './PartsChip';
import { createEmptyPartsAttribute } from '../../classes/WWAData';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    state: LoadState;
    attribute: number[][];
    partsMax: number;
    image: CanvasImageSource;
}

export default class MapLayer extends React.Component<Props> {
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        attribute: [],
        partsMax: WWAConsts.PARTS_SIZE_DEFAULT,
        image: new Image()
    }

    private getAttributes(): number[][] {
        let partsAttribute = this.props.attribute;

        for (let index = this.props.attribute.length; index < this.props.partsMax; index++) {
            partsAttribute.push(createEmptyPartsAttribute());
        }
        return partsAttribute;
    }

    /**
     * PartsChip を描画します。
     * @param {number} partsAttribute パーツ属性
     * @param {number} partsNumber パーツ番号
     * @returns {JSX.Element}
     */
    private renderPartsChip(partsAttribute: number[], partsNumber: number): JSX.Element {
        const cropX = partsAttribute[WWAConsts.ATR_X];
        const cropY = partsAttribute[WWAConsts.ATR_Y];
        return (
            <PartsChip
                key={partsNumber.toString()}
                image={this.props.image}
                cropX={cropX}
                cropY={cropY}
            ></PartsChip>
        );
    }

    public render() {
        return (
            <div className={styles.partsList}>
                {this.getAttributes().map(
                    (partsAttribute, partsNumber) => this.renderPartsChip(partsAttribute, partsNumber)
                )}
            </div>
        )
    }
}
