import React from "react";
import WWAConsts from "../../classes/WWAConsts"
import { WaitTimeInput, SoundNumberInput, ItemPartsInput, MessageInput } from "./utils";
import { PartsEditComponent, PartsEditComponentTable } from "./definitions";
import { LocalGateEdit, URLGateEdit } from "./CommonEditForm";
import { PartsAppearInput } from "./PartsAppearInput";

const MapStreetEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <>
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={value => onAttributeChange({ value, attributeIndex: WWAConsts.ATR_NUMBER })}
        />
        <ItemPartsInput
            label="反応するアイテム番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={value => {
                onAttributeChange({ value, attributeIndex: WWAConsts.ATR_ITEM });
            }}
        />
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_SOUND]}
            onChange={value => onAttributeChange({ value, attributeIndex: WWAConsts.ATR_SOUND })}
        />
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={value => onMessageChange(value)}
        />
    </>
);

const MapWallEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <>
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={value => onMessageChange(value)}
        />
    </>
);

export const MapEditTable: PartsEditComponentTable = [
    {
        id: WWAConsts.MAP_STREET,
        name: "道",
        component: MapStreetEdit,
        partsAppear: PartsAppearInput
    }, {
        id: WWAConsts.MAP_WALL,
        name: "壁",
        component: MapWallEdit,
        partsAppear: PartsAppearInput
    }, {
        id: WWAConsts.MAP_LOCALGATE,
        name: "ジャンプゲート",
        component: LocalGateEdit,
        partsAppear: PartsAppearInput
    }, {
        id: WWAConsts.MAP_URLGATE,
        name: "URLゲート",
        component: URLGateEdit
    }
];
