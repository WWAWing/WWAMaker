import WWAConsts from "../../classes/WWAConsts"
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";
import { MapStreetEditForm } from "./map/street";

interface Props {
    partsNumber: number;
    partsInfo: PartsEditPropsWithMessage;
}

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const MapEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        switch (props.partsInfo.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.MAP_STREET:
                return <MapStreetEditForm attribute={props.partsInfo.attribute} message={props.partsInfo.message}></MapStreetEditForm>;
        }
        return <></>;
    }

    return (
        <div>
            <div>背景パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    );
}
