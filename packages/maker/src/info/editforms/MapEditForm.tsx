import WWAConsts from "../../classes/WWAConsts"
import React, { useState } from "react";
import {
    NumberInput,
    WaitTimeInput,
    SoundNumberInput,
    MessageInput
} from "./EditFormUtils";
import { PartsEditComponent, PartsEditComponentTable } from "./PartsEditComponent";
import { LocalGateEdit, URLGateEdit } from "./CommonEditForm";
import { PartsAppearInput } from "./PartsAppearInput";
import { ObjectPartsBrowse } from "../../common/BrowseParts";
import { Button } from "semantic-ui-react";

const MapStreetEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => {
    const [isBrowseModalOpen, setBrowseModalOpen] = useState(false);
    return (
        <>
            <WaitTimeInput
                value={attribute[WWAConsts.ATR_NUMBER]}
                onChange={value => onAttributeChange(value, WWAConsts.ATR_NUMBER)}
            />
            <NumberInput
                label="反応するアイテム番号"
                value={attribute[WWAConsts.ATR_ITEM]}
                onChange={value => onAttributeChange(value, WWAConsts.ATR_ITEM)}
            />
            <Button
                onClick={() => setBrowseModalOpen(true)}
            >参照</Button>
            <ObjectPartsBrowse
                isOpen={isBrowseModalOpen}
                onSubmit={number => onAttributeChange(number.toString(), WWAConsts.ATR_ITEM)}
                onClose={() => setBrowseModalOpen(false)}
                selectingPartsNumber={attribute[WWAConsts.ATR_ITEM]}
            />
            <SoundNumberInput
                value={attribute[WWAConsts.ATR_SOUND]}
                onChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            />
            <MessageInput
                label="表示メッセージ"
                value={message}
                onChange={value => onMessageChange(value)}
            />
        </>
    );
};

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
