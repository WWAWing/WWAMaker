import React from "react";
import { PartsEditComponent, URLInput, StringInput, NumberInput, PartsEditMessageChange } from "./EditFormUtils";
import WWAConsts from "../../classes/WWAConsts";

/**
 * URLゲートの編集画面のコンポーネントです。
 *     物体パーツのURLゲートも背景パーツのURLゲートも編集画面は共通のため、物体背景ともにこのコンポーネントから参照されます。
 * @todo 実装する
 */
export const URLGateEdit: PartsEditComponent = (attribute, message, onAttributeChange, onMessageChange) => {
    const messageLines = message.split(/\r|\n|\r\n/);
    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>, onMessageChange: PartsEditMessageChange) => {

    }
    return (
        <div>
            <p>URLゲート</p>
            <URLInput
                label="リンク先のURLアドレス"
                value={messageLines[0]}
                onChange={event => handleMessageChange(event, onMessageChange)}
            />
            <StringInput
                label="URL TARGET"
                value={messageLines[1]}
                onChange={event => handleMessageChange(event, onMessageChange)}
            />
        </div>
    );
};

/**
 * ジャンプゲートの編集画面のコンポーネントです。
 */
export const LocalGateEdit: PartsEditComponent = (attribute, message, onAttributeChange) => {
    return (
        <div>
            <p>ジャンプゲート</p>
            <NumberInput
                label="ジャンプ先X座標"
                value={attribute[WWAConsts.ATR_JUMP_X]}
                onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_JUMP_X)}
            />
            <NumberInput
                label="ジャンプ先Y座標"
                value={attribute[WWAConsts.ATR_JUMP_Y]}
                onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_JUMP_Y)}
            />
        </div>
    );
};
