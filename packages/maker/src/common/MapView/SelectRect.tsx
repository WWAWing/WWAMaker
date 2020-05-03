import React from "react";
import styles from "./index.module.scss";
import WWAConsts from "../../classes/WWAConsts";

export interface Props {
    chipX: number;
    chipY: number;
    chipWidth: number;
    chipHeight: number;
};

/**
 * 選択している四角部分のコンポーネントです。
 * @param props 
 */
const SelectRect: React.FC<Props> = props => {
    return (
        <div
            className={styles.selectRect}
            style={{
                transform: `translate(${props.chipX * WWAConsts.CHIP_SIZE}px, ${props.chipY * WWAConsts.CHIP_SIZE}px)`,
                width: props.chipWidth * WWAConsts.CHIP_SIZE,
                height: props.chipHeight * WWAConsts.CHIP_SIZE
            }}
        />
    )
};

export default SelectRect;
