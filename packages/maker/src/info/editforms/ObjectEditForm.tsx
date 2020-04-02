import WWAConsts from "../../classes/WWAConsts";
import React from "react";
import {
    PartsEditComponent,
    MoveTypeInput,
    PassableInput,
    SoundNumberInput,
    WaitTimeInput,
    MessageInput,
    StatusInput,
    NumberInput,
    SelectInput,
    PartsEditAttributeChange,
    PartsEditComponentTable
} from "./EditFormUtils";
import { ItemMode } from "../../classes/WWAData";
import { URLGateEdit, LocalGateEdit } from "./CommonEditForm";

/**
 * StatusInput で与えられた各入力欄の名前に対し、属性のインデックスを見つけ出します。
 */
const handleStatusInputChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: PartsEditAttributeChange) => {
    switch (event.target.name) {
        case "energy":
            onChange(event.target.value, WWAConsts.ATR_ENERGY);
            break;
        case "strength":
            onChange(event.target.value, WWAConsts.ATR_STRENGTH);
            break;
        case "defence":
            onChange(event.target.value, WWAConsts.ATR_DEFENCE);
            break;
        case "gold":
            onChange(event.target.value, WWAConsts.ATR_GOLD);
    }
};

const ObjectNormalEdit: PartsEditComponent = ({attribute, message, onAttributeChange}) => (
    <div>
        <p>通常物体</p>
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MODE)}
        />
    </div>
);

const ObjectMessageEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>メッセージ</p>
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_SOUND]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
        />
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
        />
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_NUMBER)}
        />
        <MessageInput
            value={message}
            label="表示メッセージ"
            onChange={() => {}}
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
            onChange={event => handleStatusInputChange(event, onAttributeChange)}
        />
        <NumberInput
            label="モンスター所持アイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="戦闘後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
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
            onChange={event => handleStatusInputChange(event, onAttributeChange)}
        />
        <NumberInput
            label="アイテムボックスへの格納位置"
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_NUMBER)}
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
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MODE)}
        />
        <ObjectCommonInput
            messageLabel="アイテム取得後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
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
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MODE)}
        />
        <NumberInput
            label="対応するアイテム(鍵)の物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_ITEM)}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MODE)}
        />
        <ObjectCommonInput
            messageLabel="扉解放後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
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
            onChange={event => handleStatusInputChange(event, onAttributeChange)}
        />
        <ObjectCommonInput
            messageLabel="ステータス変化後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
        />
    </div>
);

const ObjectSellItemEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>物を売る</p>
        <NumberInput
            label="販売金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_GOLD)}
        />
        <NumberInput
            label="売るアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_ITEM)}
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
            onChange={event => handleStatusInputChange(event, onAttributeChange)}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
        />
    </div>
);

const ObjectBuyItemEdit: PartsEditComponent = ({attribute, message, onAttributeChange, onMessageChange}) => (
    <div>
        <p>物を買う</p>
        <NumberInput
            label="買い取り金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_GOLD)}
        />
        <NumberInput
            label="買うアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_ITEM)}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
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
            onChange={event => handleStatusInputChange(event, onAttributeChange)}
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
                <input
                    key={index}
                    type="number"
                    value={attribute[index]}
                    onChange={event => onAttributeChange(event.target.value, index)}
                ></input>
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
            onSoundChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_SOUND)}
            onMoveChange={event => onAttributeChange(event.target.value, WWAConsts.ATR_MOVE)}
            onMessageChange={event => onMessageChange(event.target.value)}
        />
    </div>
);

/**
 * 一部の物体パーツの編集画面に付いている「サウンド番号」「動作属性」「メッセージ」の3つの入力欄をセットにしたコンポーネントです。
 */
const ObjectCommonInput: React.StatelessComponent<{
    messageLabel: string,
    soundValue: number,
    moveValue: number,
    messageValue: string,
    onSoundChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onMoveChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}> = props => (
    <>
        <SoundNumberInput
            value={props.soundValue}
            onChange={props.onSoundChange}
        />
        <MoveTypeInput
            value={props.moveValue}
            onChange={props.onMoveChange}
        />
        <MessageInput
            label={props.messageLabel}
            value={props.messageValue}
            onChange={props.onMessageChange}
        />
    </>
)

/**
 * 物体パーツのパーツ種別一覧です。
 */
export const ObjectEditTable: PartsEditComponentTable = {
    [WWAConsts.OBJECT_NORMAL]: {
        name: "通常物体",
        component: ObjectNormalEdit
    },
    [WWAConsts.OBJECT_MESSAGE]: {
        name: "メッセージ",
        component: ObjectMessageEdit
    },
    [WWAConsts.OBJECT_MONSTER]: {
        name: "モンスター",
        component: ObjectMonsterEdit
    },
    [WWAConsts.OBJECT_ITEM]: {
        name: "アイテム",
        component: ObjectItemEdit
    },
    [WWAConsts.OBJECT_DOOR]: {
        name: "扉",
        component: ObjectDoorEdit
    },
    [WWAConsts.OBJECT_STATUS]: {
        name: "ステータス変化",
        component: ObjectStatusEdit
    },
    [WWAConsts.OBJECT_SELL]: {
        name: "アイテムを売る",
        component: ObjectSellItemEdit
    },
    [WWAConsts.OBJECT_BUY]: {
        name: "アイテムを買う",
        component: ObjectBuyItemEdit
    },
    [WWAConsts.OBJECT_URLGATE]: {
        name: "URLゲート",
        component: URLGateEdit
    },
    [WWAConsts.OBJECT_SCORE]: {
        name: "スコア表示",
        component: ObjectScoreEdit
    },
    [WWAConsts.OBJECT_RANDOM]: {
        name: "ランダム選択",
        component: ObjectRandomEdit
    },
    [WWAConsts.OBJECT_SELECT]: {
        name: "二者択一",
        component: ObjectSelectEdit
    },
    [WWAConsts.OBJECT_LOCALGATE]: {
        name: "ジャンプゲート",
        component: LocalGateEdit
    }
};
