import React from "react";
import PartsChip from "./PartsChip";
import WWAConsts from "../classes/WWAConsts";
import { PartsType, PartsAttributes } from "../classes/WWAData";
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
            <div className={styles.partsListContainer}>
                {props.attribute.map(renderPartsChip)}
            </div>
        </div>
    );

};

export default PartsList;
