import WWAConsts from "../../classes/WWAConsts"
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";
import {
    PartsEditComponent,
    LocalGateEdit,
    URLGateEdit,
    PartsEditAttributeChange,
    PartsEditMessageChange,
    NumberInput,
    WaitTimeInput,
    SoundNumberInput,
    MessageInput
} from "./EditFormCommon";

interface Props {
    partsNumber: number;
    partsInfo: PartsEditPropsWithMessage;
    onAttributeChange: PartsEditAttributeChange;
    onMessageChange: PartsEditMessageChange;
}

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const MapEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        /**
         * パーツ編集フォームの作り方は ObjectEditForm に準じます。
         * @see ObjectEditForm
         */
        const attribute = props.partsInfo.attribute;
        const message = props.partsInfo.message;

        switch (props.partsInfo.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.MAP_STREET:
                return MapStreetEdit(attribute, message);
            case WWAConsts.MAP_WALL:
                return MapWallEdit(attribute, message);
            case WWAConsts.MAP_LOCALGATE:
                return LocalGateEdit(attribute, message);
            case WWAConsts.MAP_URLGATE:
                return URLGateEdit(attribute, message);
        }
        return <><p>対応している背景パーツが見つかりませんでした。</p></>;
    }

    return (
        <div>
            <div>背景パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    );
}

const MapStreetEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>道</p>
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={() => {}}
        />
        <NumberInput
            label="反応するアイテム番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={() => {}}
        />
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_SOUND]}
            onChange={() => {}}
        />
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={() => {}}
        />
    </div>
);

const MapWallEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>壁</p>
        <MessageInput
            label="表示メッセージ"
            value={message}
            onChange={() => {}}
        />
    </div>
);
