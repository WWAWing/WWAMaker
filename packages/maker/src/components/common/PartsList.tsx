import React from 'react';
import styles from './PartsList.module.scss';
import PartsChip from './PartsChip';
import { createEmptyPartsAttribute } from '../../classes/WWAData';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    attribute: number[][];
    selectParts: number;
    image: CanvasImageSource;
    onClick: (partsNumber: number) => void;
}

export default class PartsList extends React.Component<Props> {
    /**
     * @todo dispatch を defaultProps に含める場合どうするか調べる。
     */
    public static defaultProps: Props = {
        attribute: [],
        selectParts: 0,
        image: new Image(),
        onClick: () => {}
    }

    private getAttributes(): number[][] {
        let partsAttribute = this.props.attribute;
        const partsMax = getPartsCountPerIncreaseUnit(this.props.attribute.length);

        for (let index = this.props.attribute.length; index < partsMax; index++) {
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
        const isSelected = partsNumber === this.props.selectParts;
        return (
            <PartsChip
                key={partsNumber.toString()}
                image={this.props.image}
                cropX={cropX}
                cropY={cropY}
                isSelected={isSelected}
                onClick={() => { this.props.onClick(partsNumber) } }
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

/**
 * 指定したパーツ数をパーツ増減数の単位で収まる値に計算します。
 *     例えばパーツ数が 256 でパーツ増減数の単位が 50 とした場合は、 300 が出力されます。
 * @param partsCount 
 */
function getPartsCountPerIncreaseUnit(partsCount: number): number {
    if (partsCount < WWAConsts.PARTS_SIZE_DEFAULT) {
        return WWAConsts.PARTS_SIZE_DEFAULT;
    }
    return Math.ceil(partsCount / WWAConsts.PARTS_SIZE_INCREASE_UNIT) * WWAConsts.PARTS_SIZE_INCREASE_UNIT;
}
