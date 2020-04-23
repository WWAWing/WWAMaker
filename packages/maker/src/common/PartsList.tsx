import React from "react";
import PartsChip from "./PartsChip";
import WWAConsts from "../classes/WWAConsts";
import { PartsType, createEmptyPartsAttribute, PartsAttributes } from "../classes/WWAData";
import getPartsCountPerIncreaseUnit from "./getPartsCountPerIncreaseUnit";
import styles from "./PartsList.module.scss";

interface Props {
    type: PartsType;
    attribute: PartsAttributes;
    selectPartsNumber: number;
    image: CanvasImageSource;
    onPartsSelect: (partsNumber: number, partsType: PartsType) => void;
    onPartsEdit: (partsType: PartsType) => void;
}

export default class PartsList extends React.Component<Props> {

    /**
     * パーツの属性を空部分を補填した形で取得します。
     */
    private getAttributes(): PartsAttributes {
        let partsAttribute = this.props.attribute;
        const partsMax = getPartsCountPerIncreaseUnit(this.props.attribute.length);

        for (let index = this.props.attribute.length; index < partsMax; index++) {
            partsAttribute.push(createEmptyPartsAttribute(this.props.type));
        }
        return partsAttribute;
    }

    public render() {
        return (
            <div className={styles.partsList}>
                {this.getAttributes().map((partsAttribute, partsNumber) =>
                    <PartsChip
                        key={partsNumber.toString()}
                        image={this.props.image}
                        cropX={partsAttribute[WWAConsts.ATR_X]}
                        cropY={partsAttribute[WWAConsts.ATR_Y]}
                        isSelected={partsNumber === this.props.selectPartsNumber}
                        onClick={() => this.props.onPartsSelect(partsNumber, this.props.type)}
                        onDoubleClick={() => this.props.onPartsEdit(this.props.type)}
                    />
                )}
            </div>
        );
    }

};
