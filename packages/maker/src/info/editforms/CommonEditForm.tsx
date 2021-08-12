import React, { useState } from "react";
import { URLInput, StringInput, NewCoordInput } from "./EditFormUtils";
import { PartsEditComponent } from "./PartsEditComponent";
import WWAConsts from "../../classes/WWAConsts";
import { convertRelativeValueFromCoord } from "../../common/convertRelativeValue";

// 物体パーツと背景パーツ共通で使用される編集画面のコンポーネントです。

/**
 * URLゲートの編集画面のコンポーネントです。
 *     物体パーツのURLゲートも背景パーツのURLゲートも編集画面は共通のため、物体背景ともにこのコンポーネントから参照されます。
 */
export const URLGateEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => {
    const messageLine = message.split(/\r|\n|\r\n/);
    const [urlValue, setURL] = useState<string>(messageLine[0]);
    const [targetValue, setTarget] = useState<string>(messageLine.length >= 2 ? messageLine[1] : "");

    const handleURLChange = (value: string) => {
        setURL(value);
        onMessageChange([urlValue, targetValue].join("\n"));
    };
    const handleTargetChange = (value: string) => {
        setTarget(value);
        onMessageChange([urlValue, targetValue].join("\n"));
    };

    return (
        <>
            <URLInput
                label="リンク先のURLアドレス"
                value={urlValue}
                onChange={value => handleURLChange(value)}
            />
            <StringInput
                label="URL TARGET"
                value={targetValue}
                onChange={value => handleTargetChange(value)}
            />
        </>
    );
};

/**
 * ジャンプゲートの編集画面のコンポーネントです。
 */
export const LocalGateEdit: PartsEditComponent = ({attribute, message, onAttributeChange}) => {
    // FIXME: X 座標が変わってくれない
    return (
        <>
            <NewCoordInput
                label="ジャンプ先座標"
                x={convertRelativeValueFromCoord(attribute[WWAConsts.ATR_JUMP_X])}
                y={convertRelativeValueFromCoord(attribute[WWAConsts.ATR_JUMP_Y])}
                onSubmitX={value => onAttributeChange(value, WWAConsts.ATR_JUMP_X)}
                onSubmitY={value => onAttributeChange(value, WWAConsts.ATR_JUMP_Y)}
            />
        </>
    );
};
