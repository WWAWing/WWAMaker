import React from "react";
import { InputChangeFunction } from "./definitions";
import { SoundNumberInput } from "./NumberInput";
import { MoveTypeInput } from "./SelectInput";
import { MessageInput } from "./MessageInput";

/**
 * 一部の物体パーツの編集画面に付いている「サウンド番号」「動作属性」「メッセージ」の3つの入力欄をセットにしたコンポーネントです。
 */

export const ObjectCommonInput: React.FunctionComponent<{
    messageLabel: string;
    soundValue: number;
    moveValue: number;
    messageValue: string;
    onSoundChange: InputChangeFunction;
    onMoveChange: InputChangeFunction;
    onMessageChange: InputChangeFunction;
}> = props => (
    <>
        <SoundNumberInput
            value={props.soundValue}
            onChange={props.onSoundChange} />
        <MoveTypeInput
            value={props.moveValue}
            onChange={props.onMoveChange} />
        <MessageInput
            label={props.messageLabel}
            value={props.messageValue}
            onChange={props.onMessageChange} />
    </>
);
