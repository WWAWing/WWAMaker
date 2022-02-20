import React from "react";
import PartsChip from "./PartsChip";
import WWAConsts from "../classes/WWAConsts";
import { PartsType, PartsAttributes } from "../classes/WWAData";
import styles from "./PartsList.module.scss";
import { useImage } from "wwamaker-image-decorder";
import { useSelector } from "react-redux";

interface Props {
    type: PartsType;
    attribute: PartsAttributes;
    selectPartsNumber?: number;
    image?: CanvasImageSource;
    onPartsSelect: (partsNumber: number, partsType: PartsType) => void;
    onPartsEdit: (partsNumber: number, partsType: PartsType) => void;
}

const PartsList: React.FC<Props> = props => {

    const imageUrl = useSelector(state => state.image);
    const imageResource = useImage(imageUrl ?? "");

    if (imageResource === null) {
        return null;
    }

    const renderPartsChip = (partsAttribute: number[], partsNumber: number) =>
        <PartsChip
            key={partsNumber.toString()}
            image={props.image ?? imageResource}
            cropX={partsAttribute[WWAConsts.ATR_X]}
            cropY={partsAttribute[WWAConsts.ATR_Y]}
            isSelected={props.selectPartsNumber !== undefined && partsNumber === props.selectPartsNumber}
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
