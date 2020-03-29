import WWAConsts from "../../classes/WWAConsts";
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";
import { EditForms, EditForm, createSoundEditForm, createWaitTimeEditForm, createMessageEditForm } from "./EditFormCommon";
import { MoveType, ItemMode } from "../../classes/WWAData";

interface Props {
    partsNumber: number;
    partsInfo: PartsEditPropsWithMessage;
}

/**
 * 「動作属性」の入力フォームの情報を作成します。
 * @see EditForm
 */
const createMoveTypeEditForm = (moveTypeValue: number): EditForm => ({
    type: "SELECT",
    label: "動作属性",
    selectableItems: [
        {
            label: "静止",
            value: MoveType.STATIC
        }, {
            label: "プレイヤー追尾",
            value: MoveType.CHASE_PLAYER
        }, {
            label: "逃げる",
            value: MoveType.RUN_OUT
        }, {
            label: "うろうろする",
            value: MoveType.HANG_AROUND
        }
    ],
    value: moveTypeValue
});

/**
 * 「通行区分」の入力フォームの情報を作成します。
 * @see EditForm
 */
const createStreetTypeEditForm = (passableValue: number): EditForm => ({
    type: "SELECT",
    label: "通行区分",
    selectableItems: [
        {
            label: "通行不可",
            value: 0
        }, {
            label: "通行可",
            value: WWAConsts.PASSABLE_OBJECT
        }
    ],
    value: passableValue
});

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const ObjectEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        /**
         * パーツ編集フォームを作る際に渡す属性のエイリアスです。
         */
        const partsAttribute = props.partsInfo.attribute;
        const partsMessage = props.partsInfo.message;

        switch (props.partsInfo.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.OBJECT_NORMAL:
                return <div>
                    <p>通常物体</p>
                    <EditForms
                        forms={[
                            createMoveTypeEditForm(partsAttribute[WWAConsts.ATR_MOVE]),
                            createStreetTypeEditForm(partsAttribute[WWAConsts.ATR_MODE])
                        ]}
                    ></EditForms>
                </div>;
            case WWAConsts.OBJECT_MESSAGE:
                return <div>
                    <p>メッセージ</p>
                    <EditForms
                        forms={[
                            createSoundEditForm(partsAttribute[WWAConsts.ATR_SOUND]),
                            createMoveTypeEditForm(partsAttribute[WWAConsts.ATR_MOVE]),
                            createWaitTimeEditForm(partsAttribute[WWAConsts.ATR_NUMBER]),
                            {
                                type: "MESSAGE",
                                value: props.partsInfo.message
                            }
                        ]}
                    ></EditForms>
                </div>;
            case WWAConsts.OBJECT_MONSTER:
                return <div>
                    <p>モンスター</p>
                    <EditForms
                        forms={[
                            {
                                type: "STATUS",
                                items: {
                                    energy: {
                                        label: "生命力",
                                        value: partsAttribute[WWAConsts.ATR_ENERGY]
                                    },
                                    strength: {
                                        label: "生命力",
                                        value: partsAttribute[WWAConsts.ATR_STRENGTH]
                                    },
                                    defence: {
                                        label: "防御力",
                                        value: partsAttribute[WWAConsts.ATR_DEFENCE]
                                    },
                                    gold: {
                                        label: "生命力",
                                        value: partsAttribute[WWAConsts.ATR_GOLD]
                                    }
                                }
                            }, {
                                type: "NUMBER",
                                label: "モンスター所持アイテムの物体番号",
                                value: partsAttribute[WWAConsts.ATR_ITEM]
                            },
                            createSoundEditForm(partsAttribute[WWAConsts.ATR_SOUND]),
                            createMoveTypeEditForm(partsAttribute[WWAConsts.ATR_MOVE]),
                            createMessageEditForm(partsMessage)
                        ]}
                    ></EditForms>
                </div>
            case WWAConsts.OBJECT_ITEM:
                return <div>
                    <p>アイテム</p>
                    <EditForms
                        forms={[
                            {
                                type: "STATUS",
                                items: {
                                    strength: {
                                        label: "攻撃力",
                                        value: partsAttribute[WWAConsts.ATR_STRENGTH]
                                    },
                                    defence: {
                                        label: "防御力",
                                        value: partsAttribute[WWAConsts.ATR_DEFENCE]
                                    }
                                }
                            }, {
                                type: "NUMBER",
                                label: "アイテムボックスへの格納位置",
                                value: partsAttribute[WWAConsts.ATR_NUMBER]
                            },
                            createSoundEditForm(partsAttribute[WWAConsts.ATR_SOUND]),
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
                                value: partsAttribute[WWAConsts.ATR_MODE]
                            },
                            createMoveTypeEditForm(partsAttribute[WWAConsts.ATR_MOVE])
                        ]}
                    ></EditForms>
                </div>
        }
        return <></>;
    }

    return ( // TODO: グラフィック画像を表示する
        <div>
            <div>物体パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    )
}
