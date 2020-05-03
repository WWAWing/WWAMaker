import React from "react";
import styles from './index.module.scss';
import MapCanvas, { UserProps as MapCanvasProps, TargetParts } from "./MapCanvas";
import SelectRect, { Props as SelectRectProps } from "./SelectRect";

type Props = MapCanvasProps & {
    selectRect?: SelectRectProps
};

/**
 * マップを表示するコンポーネントです。
 * @param props 
 */
const MapView: React.FC<Props> = props => {
    return (
        <div className={styles.mapCanvasWrapper}>
            <MapCanvas {...props} />
            {props.selectRect !== undefined &&
                <SelectRect {...props.selectRect} />
            }
        </div>
    );
};

export default MapView;
export type { TargetParts, SelectRectProps };
