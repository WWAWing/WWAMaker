import WWAConsts from "../../classes/WWAConsts";
import React from "react";
import {
    MoveTypeInput,
    PassableInput,
    SoundNumberInput,
    WaitTimeInput,
    MessageInput,
    StatusInput,
    NumberInput,
    SelectInput,
    ObjectCommonInput
} from "./EditFormUtils";
import { PartsEditComponent, PartsEditComponentTable, PartsEditAttributeChange } from "./PartsEditComponent";
import { ItemMode } from "../../classes/WWAData";
import { URLGateEdit, LocalGateEdit } from "./CommonEditForm";
import { Input } from "semantic-ui-react";

/**
 * StatusInput で与えられた各入力欄の名前に対し、属性のインデックスを見つけ出します。
 */
const handleStatusInputChange = (value: string, name: string, onChange: PartsEditAttributeChange) => {
    switch (name) {
        case "energy":
            onChange(value, WWAConsts.ATR_ENERGY);
            break;
        case "strength":
            onChange(value, WWAConsts.ATR_STRENGTH);
            break;
        case "defence":
            onChange(value, WWAConsts.ATR_DEFENCE);
            break;
        case "gold":
            onChange(value, WWAConsts.ATR_GOLD);
    }
};

const ObjectNormalEdit: PartsEditComponent = ({attribute, message, onAttributeChange}) => (
    <div>
        <p>通常物体</p>
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MODE)}
        />
    </div>
);

const ObjectMessageEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>メッセージ</p>
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_SOUND]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
        />
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
        />
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_NUMBER)}
        />
        <MessageInput
            value={message}
            label="表示メッセージ"
            onChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectMonsterEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>モンスター</p>
        <StatusInput
            items={{
                energy: {
                    value: attribute[WWAConsts.ATR_ENERGY]
                },
                strength: {
                    value: attribute[WWAConsts.ATR_STRENGTH]
                },
                defence: {
                    value: attribute[WWAConsts.ATR_DEFENCE]
                },
                gold: {
                    value: attribute[WWAConsts.ATR_GOLD]
                }
            }}
            onChange={(event, name) => handleStatusInputChange(event, name, onAttributeChange)}
        />
        <NumberInput
            label="モンスター所持アイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_ITEM)}
        />
        <ObjectCommonInput
            messageLabel="戦闘後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectItemEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>アイテム</p>
        <StatusInput
            items={{
                strength: {
                    value: attribute[WWAConsts.ATR_STRENGTH]
                },
                defence: {
                    value: attribute[WWAConsts.ATR_DEFENCE]
                }
            }}
            onChange={(value, name) => handleStatusInputChange(value, name, onAttributeChange)}
        />
        <NumberInput
            label="アイテムボックスへの格納位置"
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_NUMBER)}
        />
        <SelectInput
            label="使用属性"
            selectableItems={[
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
            ]}
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MODE)}
        />
        <ObjectCommonInput
            messageLabel="アイテム取得後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectDoorEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>扉</p>
        <SelectInput
            label="扉の種類"
            selectableItems={[
                {
                    label: "鍵なくなる",
                    value: 0
                }, {
                    label: "鍵なくならない",
                    value: 1
                }
            ]}
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MODE)}
        />
        <NumberInput
            label="対応するアイテム(鍵)の物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_ITEM)}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_MODE)}
        />
        <ObjectCommonInput
            messageLabel="扉解放後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectStatusEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>ステータス変化</p>
        <StatusInput
            items={{
                energy: {
                    value: attribute[WWAConsts.ATR_ENERGY]
                },
                strength: {
                    value: attribute[WWAConsts.ATR_STRENGTH]
                },
                defence: {
                    value: attribute[WWAConsts.ATR_DEFENCE]
                },
                gold: {
                    value: attribute[WWAConsts.ATR_GOLD]
                }
            }}
            onChange={(event, name) => handleStatusInputChange(event, name, onAttributeChange)}
        />
        <ObjectCommonInput
            messageLabel="ステータス変化後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectSellItemEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>物を売る</p>
        <NumberInput
            label="販売金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_GOLD)}
        />
        <NumberInput
            label="売るアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_ITEM)}
        />
        <StatusInput
            items={{
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
            }}
            onChange={(event, name) => handleStatusInputChange(event, name, onAttributeChange)}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectBuyItemEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>物を買う</p>
        <NumberInput
            label="買い取り金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_GOLD)}
        />
        <NumberInput
            label="買うアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={value => onAttributeChange(value, WWAConsts.ATR_ITEM)}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

const ObjectScoreEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>スコア表示</p>
        <StatusInput
            items={{
                energy: {
                    label: "生命力×",
                    value: attribute[WWAConsts.ATR_ENERGY]
                },
                strength: {
                    label: "攻撃力×",
                    value: attribute[WWAConsts.ATR_STRENGTH]
                },
                defence: {
                    label: "防御力×",
                    value: attribute[WWAConsts.ATR_DEFENCE]
                },
                gold: {
                    label: "所持金×",
                    value: attribute[WWAConsts.ATR_GOLD]
                }
            }}
            onChange={(event, name) => handleStatusInputChange(event, name, onAttributeChange)}
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
    </div>
);

const ObjectRandomEdit: PartsEditComponent = ({attribute, message, onAttributeChange}) => {
    /**
     * 指定した順番から1つずつ増える配列を作成します。
     *     ランダム選択のパーツでは ATR_RANDOM_BASE から RANDOM_ITERATION_MAX の分がターゲットパーツ番号として使用します
     *     その番号の分の入力欄を作る際に、 attribute の参照に使用するインデックスが必要があります。
     *     React では JSX 構文内で for を回すことは難しいため、予めインデックスの配列を作成してその配列で参照するようにします。
     */
    const createCountUpArray = (first: number, count: number) => {
        let result = [];
        for (let index = 0; index < count; index++) {
            result.push(first + index);
        }
        return result;
    }

    return (
        <div>
            <p>ランダム選択</p>
            <div>選択するパーツの物体番号</div>
            {createCountUpArray(WWAConsts.ATR_RANDOM_BASE, WWAConsts.RANDOM_ITERATION_MAX).map(index => (
                <Input
                    key={index}
                    type="number"
                    value={attribute[index]}
                    onChange={(event, data) => {
                        onAttributeChange(data.value, index);
                    }}
                ></Input>
            ))}
        </div>
    );
}

const ObjectSelectEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={value => onAttributeChange(value, WWAConsts.ATR_SOUND)}
            onMoveChange={value => onAttributeChange(value, WWAConsts.ATR_MOVE)}
            onMessageChange={value => onMessageChange(value)}
        />
    </div>
);

/**
 * 物体パーツのパーツ種別一覧です。
 */
export const ObjectEditTable: PartsEditComponentTable = [
    {
        id: WWAConsts.OBJECT_NORMAL,
        name: "通常物体",
        component: ObjectNormalEdit
    }, {
        id: WWAConsts.OBJECT_MESSAGE,
        name: "メッセージ",
        component: ObjectMessageEdit
    }, {
        id: WWAConsts.OBJECT_MONSTER,
        name: "モンスター",
        component: ObjectMonsterEdit
    }, {
        id: WWAConsts.OBJECT_ITEM,
        name: "アイテム",
        component: ObjectItemEdit
    }, {
        id: WWAConsts.OBJECT_DOOR,
        name: "扉",
        component: ObjectDoorEdit
    }, {
        id: WWAConsts.OBJECT_STATUS,
        name: "ステータス変化",
        component: ObjectStatusEdit
    }, {
        id: WWAConsts.OBJECT_SELL,
        name: "アイテムを売る",
        component: ObjectSellItemEdit
    }, {
        id: WWAConsts.OBJECT_BUY,
        name: "アイテムを買う",
        component: ObjectBuyItemEdit
    }, {
        id: WWAConsts.OBJECT_URLGATE,
        name: "URLゲート",
        component: URLGateEdit
    }, {
        id: WWAConsts.OBJECT_SCORE,
        name: "スコア表示",
        component: ObjectScoreEdit
    }, {
        id: WWAConsts.OBJECT_RANDOM,
        name: "ランダム選択",
        component: ObjectRandomEdit
    }, {
        id: WWAConsts.OBJECT_SELECT,
        name: "二者択一",
        component: ObjectSelectEdit
    }, {
        id: WWAConsts.OBJECT_LOCALGATE,
        name: "ジャンプゲート",
        component: LocalGateEdit
    }
];
