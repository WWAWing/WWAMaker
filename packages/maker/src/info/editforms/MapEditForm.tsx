import WWAConsts from "../../classes/WWAConsts"
import React from "react";
import {
    PartsEditComponent,
    NumberInput,
    WaitTimeInput,
    SoundNumberInput,
    MessageInput
} from "./EditFormUtils";

export const MapStreetEdit: PartsEditComponent = (attribute, message, onAttributeChange, onMessageChange) => (
    <div>
        <p>道</p>
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_NUMBER)}
        />
        <NumberInput
            label="反応するアイテム番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_ITEM)}
        />
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_SOUND]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
        />
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={event => onMessageChange(event.target.value)}
        />
    </div>
);

export const MapWallEdit: PartsEditComponent = (attribute, message, onAttributeChange, onMessageChange) => (
    <div>
        <p>壁</p>
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={event => onMessageChange(event.target.value)}
        />
    </div>
);
