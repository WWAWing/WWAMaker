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
    onPartsEdit: (partsNumber: number, partsType: PartsType) => void;
}

const PartsList: React.FC<Props> = props => {

    /**
     * パーツの属性を空部分を補填した形で取得します。
     */
    function getPartsAttributes(): PartsAttributes {
        let emptyAttributes = [];
        const partsMax = getPartsCountPerIncreaseUnit(props.attribute.length);

        for (let index = props.attribute.length; index < partsMax; index++) {
            emptyAttributes.push(createEmptyPartsAttribute(props.type));
        }
        return props.attribute.concat(emptyAttributes);
    }

    const renderPartsChip = (partsAttribute: number[], partsNumber: number) =>
        <PartsChip
            key={partsNumber.toString()}
            image={props.image}
            cropX={partsAttribute[WWAConsts.ATR_X]}
            cropY={partsAttribute[WWAConsts.ATR_Y]}
            isSelected={partsNumber === props.selectPartsNumber}
            onClick={() => props.onPartsSelect(partsNumber, props.type)}
            onDoubleClick={() => props.onPartsEdit(partsNumber, props.type)}
            onContextMenu={() => props.onPartsEdit(partsNumber, props.type)}
        />;


    return (
        <div className={styles.partsList}>
            {getPartsAttributes().map(renderPartsChip)}
        </div>
    );

};

export default PartsList;
