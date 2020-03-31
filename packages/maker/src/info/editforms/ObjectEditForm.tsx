import WWAConsts from "../../classes/WWAConsts";
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";
import {
    PartsEditComponent,
    URLGateEdit,
    LocalGateEdit,
    MoveTypeInput,
    PassableInput,
    SoundNumberInput,
    WaitTimeInput,
    MessageInput,
    StatusInput,
    NumberInput,
    SelectInput
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
            case WWAConsts.OBJECT_SCORE:
                return ObjectScoreEdit(attribute, message);
            case WWAConsts.OBJECT_RANDOM:
                return ObjectRandomEdit(attribute, message);
            case WWAConsts.OBJECT_SELECT:
                // TODO: 二者択一の場合は指定位置にパーツを出現の表示が別になるため、そうなるように考慮しておく
                return ObjectSelectEdit(attribute, message);
            case WWAConsts.OBJECT_LOCALGATE:
                return LocalGateEdit(attribute, message);
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
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={() => {}}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={() => {}}
        />
    </div>
);

const ObjectMessageEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>メッセージ</p>
        <SoundNumberInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={() => {}}
        />
        <MoveTypeInput
            value={attribute[WWAConsts.ATR_MOVE]}
            onChange={() => {}}
        />
        <WaitTimeInput
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={() => {}}
        />
        <MessageInput
            value={message}
            label="表示メッセージ"
            onChange={() => {}}
        />
    </div>
);

const ObjectMonsterEdit: PartsEditComponent = (attribute, message) => (
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
            onChange={() => {}}
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
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectItemEdit: PartsEditComponent = (attribute, message) => (
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
            onChange={() => {}}
        />
        <NumberInput
            label="アイテムボックスへの格納位置"
            value={attribute[WWAConsts.ATR_NUMBER]}
            onChange={() => {}}
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
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="アイテム取得後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectDoorEdit: PartsEditComponent = (attribute, message) => (
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
            onChange={() => {}}
        />
        <NumberInput
            label="対応するアイテム(鍵)の物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={() => {}}
        />
        <PassableInput
            value={attribute[WWAConsts.ATR_MODE]}
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="扉解放後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectStatusEdit: PartsEditComponent = (attribute, message) => (
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
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="ステータス変化後表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectSellItemEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>物を売る</p>
        <NumberInput
            label="販売金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={() => {}}
        />
        <NumberInput
            label="売るアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={() => {}}
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
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectBuyItemEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <p>物を買う</p>
        <NumberInput
            label="買い取り金額"
            value={attribute[WWAConsts.ATR_GOLD]}
            onChange={() => {}}
        />
        <NumberInput
            label="買うアイテムの物体番号"
            value={attribute[WWAConsts.ATR_ITEM]}
            onChange={() => {}}
        />
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

const ObjectScoreEdit: PartsEditComponent = (attribute, message) => (
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

const ObjectRandomEdit: PartsEditComponent = (attribute, message) => {
    /**
     * 指定した順番から1つずつ増える配列を作成します。
     *     ランダム選択のパーツでは ATR_RANDOM_BASE から RANDOM_ITERATION_MAX の分がターゲットパーツ番号として使用します
     *     その番号の分の入力欄を作る際に、 attribute の参照に使用するインデックスが必要があります。
     *     React では JSX 構文内で for を回すことは難しいため、予めインデックスの配列を作成してその配列で参照するようにします。
     */
    const createCountUpArray = (first: number, count: number) => {
        let result = [first];
        for (let index = 1; index < count; index++) {
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
                    onChange={() => {}}
                ></input>
            ))}
        </div>
    );
}

const ObjectSelectEdit: PartsEditComponent = (attribute, message) => (
    <div>
        <ObjectCommonInput
            messageLabel="表示メッセージ"
            soundValue={attribute[WWAConsts.ATR_SOUND]}
            moveValue={attribute[WWAConsts.ATR_MOVE]}
            messageValue={message}
            onSoundChange={() => {}}
            onMoveChange={() => {}}
            onMessageChange={() => {}}
        />
    </div>
);

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
