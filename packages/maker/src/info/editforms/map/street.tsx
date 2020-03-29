import React from "react";
import { PartsEditPropsWithMessage } from "../PartsEditProps";
import WWAConsts from "../../../classes/WWAConsts";

/**
 * 「道」パーツの編集画面です。
 */
export const MapStreetEditForm: React.StatelessComponent<PartsEditPropsWithMessage> = props => {
    return (
        <div>
            <div>待ち時間: {props.attribute[WWAConsts.ATR_NUMBER]}</div>
            <div>反応するアイテム番号: {props.attribute[WWAConsts.ATR_ITEM]}</div>
            <div>サウンド番号: {props.attribute[WWAConsts.ATR_SOUND]}</div>
            <div>
                {props.message}
            </div>
        </div>
    )
}
