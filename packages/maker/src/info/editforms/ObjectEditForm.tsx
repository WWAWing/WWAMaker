import WWAConsts from "../../classes/WWAConsts";
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";
import {
    EditForms,
    createSoundEditForm,
    createWaitTimeEditForm,
    createMessageEditForm,
    createMoveTypeEditForm,
    createStreetTypeEditForm,
    PartsEditComponent,
    createStatusEditForm,
    URLGateEdit
} from "./EditFormCommon";
import { ItemMode } from "../../classes/WWAData";

interface Props {
    partsNumber: number;
    partsInfo: PartsEditPropsWithMessage;
}

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const ObjectEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        /**
         * パーツ編集フォームを作る際に渡す属性のエイリアスです。
         */
        const attribute = props.partsInfo.attribute;
        const message = props.partsInfo.message;

        switch (props.partsInfo.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.OBJECT_NORMAL:
                return ObjectNormalEdit(attribute, message);
            case WWAConsts.OBJECT_MESSAGE:
                return ObjectMessageEdit(attribute, message);
            case WWAConsts.OBJECT_MONSTER:
                return ObjectMonsterEdit(attribute, message);
            case WWAConsts.OBJECT_ITEM:
                return ObjectItemEdit(attribute, message);
            case WWAConsts.OBJECT_DOOR:
                return ObjectDoorEdit(attribute, message);
            case WWAConsts.OBJECT_STATUS:
                return ObjectStatusEdit(attribute, message);
            case WWAConsts.OBJECT_SELL:
                return ObjectSellItemEdit(attribute, message);
            case WWAConsts.OBJECT_BUY:
                return ObjectBuyItemEdit(attribute, message);
            case WWAConsts.OBJECT_URLGATE:
                return URLGateEdit(attribute, message);
        }
        return <><p>対応している物体パーツが見つかりませんでした。</p></>;
    }

    return ( // TODO: グラフィック画像を表示する
        <div>
            <div>物体パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    )
}

// ここより先、物体パーツの各種別の編集画面コンポーネント

const ObjectNormalEdit: PartsEditComponent = attribute => (
    <div>
        <p>通常物体</p>
        <EditForms
            forms={[
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createStreetTypeEditForm(attribute[WWAConsts.ATR_MODE])
            ]}
        />
    </div>
);

const ObjectMessageEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>メッセージ</p>
        <EditForms
            forms={[
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createWaitTimeEditForm(attribute[WWAConsts.ATR_NUMBER]),
                createMessageEditForm(message, "表示メッセージ")
            ]}
        />
    </div>
);

const ObjectMonsterEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>モンスター</p>
        <EditForms
            forms={[
                createStatusEditForm(
                    attribute[WWAConsts.ATR_ENERGY],
                    attribute[WWAConsts.ATR_STRENGTH],
                    attribute[WWAConsts.ATR_DEFENCE],
                    attribute[WWAConsts.ATR_GOLD]
                ),
                {
                    type: "NUMBER",
                    label: "モンスター所持アイテムの物体番号",
                    value: attribute[WWAConsts.ATR_ITEM]
                },
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "戦闘後表示メッセージ")
            ]}
        />
    </div>
);

const ObjectItemEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>アイテム</p>
        <EditForms
            forms={[
                {
                    type: "STATUS",
                    items: {
                        strength: {
                            label: "攻撃力",
                            value: attribute[WWAConsts.ATR_STRENGTH]
                        },
                        defence: {
                            label: "防御力",
                            value: attribute[WWAConsts.ATR_DEFENCE]
                        }
                    }
                }, {
                    type: "NUMBER",
                    label: "アイテムボックスへの格納位置",
                    value: attribute[WWAConsts.ATR_NUMBER]
                },
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                {
                    type: "SELECT",
                    label: "使用属性",
                    selectableItems: [
                        {
                            label: "通常",
                            value: ItemMode.NORMAL
                        }, {
                            label: "クリックで使用可",
                            value: ItemMode.CAN_USE
                        }, {
                            label: "使用しても無くならない",
                            value: ItemMode.NOT_DISAPPEAR
                        }
                    ],
                    value: attribute[WWAConsts.ATR_MODE]
                },
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "アイテム取得後表示メッセージ")
            ]}
        />
    </div>
);

const ObjectDoorEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>扉</p>
        <EditForms
            forms={[
                {
                    type: "SELECT",
                    label: "扉の種類",
                    selectableItems: [
                        {
                            label: "鍵なくなる",
                            value: 0
                        }, {
                            label: "鍵なくならない",
                            value: 1
                        }
                    ],
                    value: attribute[WWAConsts.ATR_MODE]
                }, {
                    type: "NUMBER",
                    label: "対応するアイテム(鍵)の物体番号",
                    value: attribute[WWAConsts.ATR_ITEM]
                },
                createStreetTypeEditForm(attribute[WWAConsts.ATR_MODE]),
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "扉解放後表示メッセージ")
            ]}
        />
    </div>
);

const ObjectStatusEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>ステータス変化</p>
        <EditForms
            forms={[
                createStatusEditForm(
                    attribute[WWAConsts.ATR_ENERGY],
                    attribute[WWAConsts.ATR_STRENGTH],
                    attribute[WWAConsts.ATR_DEFENCE],
                    attribute[WWAConsts.ATR_GOLD]
                ),
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "ステータス変化後表示メッセージ")
            ]}
        />
    </div>
);

const ObjectSellItemEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>物を売る</p>
        <EditForms
            forms={[
                {
                    type: "NUMBER",
                    label: "販売金額",
                    value: attribute[WWAConsts.ATR_GOLD]
                }, {
                    type: "NUMBER",
                    label: "売るアイテムの物体番号",
                    value: attribute[WWAConsts.ATR_ITEM]
                }, {
                    type: "STATUS",
                    items: {
                        energy: {
                            label: "生命力",
                            value: attribute[WWAConsts.ATR_ENERGY]
                        },
                        strength: {
                            label: "攻撃力",
                            value: attribute[WWAConsts.ATR_STRENGTH]
                        },
                        defence: {
                            label: "防御力",
                            value: attribute[WWAConsts.ATR_DEFENCE]
                        }
                    }
                },
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "表示メッセージ")
            ]}
        />
    </div>
);

const ObjectBuyItemEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>物を買う</p>
        <EditForms
            forms={[
                {
                    type: "NUMBER",
                    label: "買い取り金額",
                    value: attribute[WWAConsts.ATR_GOLD]
                }, {
                    type: "NUMBER",
                    label: "買うアイテムの物体番号",
                    value: attribute[WWAConsts.ATR_ITEM]
                },
                createSoundEditForm(attribute[WWAConsts.ATR_SOUND]),
                createMoveTypeEditForm(attribute[WWAConsts.ATR_MOVE]),
                createMessageEditForm(message, "表示メッセージ")
            ]}
        />
    </div>
);
