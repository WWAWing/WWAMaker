import React from "react";
import WWAConsts from "../../classes/WWAConsts";
import { MoveType } from "../../classes/WWAData";
import { Input, Dropdown, DropdownItemProps, Form, TextArea } from "semantic-ui-react";

// このファイルはパーツ編集画面で頻繁に使用されるテキストボックスやセレクトボックスなどをまとめたコンポーネント集です。

/**
 * テキストボックスやセレクトボックスで変更が生じた際に実行するコールバック関数の型です。
 */
type InputChangeFunction = (value: string) => void;
type InputChangeFunctionWithName = (value: string, name: string) => void;

/**
 * パーツ編集で必要になるステータス入力値のうち、ステータス1つ分で必要なプロパティを示す型です。
 */
type NumberEditFormItem = {
    label?: string,
    value: number
};

export const NumberInput: React.FunctionComponent<{
    value: number,
    label: string,
    name?: string
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="number"
            name={props.name}
            value={props.value}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

/**
 * 数字を入力するコンポーネントを作成します。
 */
const createNumberInput = (label: string) => {
    return (props: {
        value: number,
        onChange: InputChangeFunction
    }) => (
        <NumberInput
            label={label}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

export const SoundNumberInput = createNumberInput("サウンド番号");
export const WaitTimeInput = createNumberInput("待ち時間");

export const SelectInput: React.FunctionComponent<{
    selectableItems: DropdownItemProps[],
    value: number,
    label: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Dropdown
            options={props.selectableItems}
            defaultValue={props.value}
            selection
            onChange={(event, data) => {
                if (data.value === undefined) {
                    return;
                }
                const value = data.value as string;
                props.onChange(value);
            }}
        />
    </Form.Field>
);

/**
 * セレクトボックスのコンポーネントを作成します。
 */
const createSelectInput = (label: string, selectableItems: DropdownItemProps[]) => {
    return (props: {
        value: number,
        onChange: InputChangeFunction
    }) => (
        <SelectInput
            label={label}
            selectableItems={selectableItems}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

export const MoveTypeInput = createSelectInput("動作属性", [
    {
        text: "静止",
        value: MoveType.STATIC,
    }, {
        text: "プレイヤー追尾",
        value: MoveType.CHASE_PLAYER
    }, {
        text: "逃げる",
        value: MoveType.RUN_OUT
    }, {
        text: "うろうろする",
        value: MoveType.HANG_AROUND
    }
]);
export const PassableInput = createSelectInput("通行区分", [
    {
        text: "通行不可",
        value: 0
    }, {
        text: "通行可",
        value: WWAConsts.PASSABLE_OBJECT
    }
]);

export const MessageInput: React.FunctionComponent<{
    value: string,
    label: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <TextArea
            value={props.value}
            onChange={(event, data) => {
                if (data.value === undefined) {
                    return;
                }
                const value = typeof data.value === "number" ? data.value.toString() : data.value;
                props.onChange(value);
            }}
        />
    </Form.Field>
);

/**
 * モンスターやアイテムで使用するステータス入力欄です。
 * @param props 下記の情報を含めた連想配列
 * 
 *     items: energy, strength, defence, gold の情報
 *     label の指定がない場合はそれぞれ 生命力、攻撃力、防御力、所持金 になります。
 * 
 *     onChange: 入力欄が変更した場合に発生するメソッド
 *     どのテキストボックから入力されたかは、 event.target.name から確認できます。
 */
export const StatusInput: React.FunctionComponent<{
    items: {
        energy?: NumberEditFormItem,
        strength: NumberEditFormItem,
        defence: NumberEditFormItem,
        gold?: NumberEditFormItem,
    },
    onChange: InputChangeFunctionWithName
}> = props => {

    const statusNumberInput = (item: NumberEditFormItem, name: string, defaultLabel: string) => (
        <NumberInput
            label={item.label !== undefined ? item.label : defaultLabel}
            onChange={value => props.onChange(value, name)}
            name={name}
            value={item.value}
        />
    )

    return (
        <>
            {props.items.energy !== undefined &&
                statusNumberInput(props.items.energy, "energy", "生命力")
            }
            {statusNumberInput(props.items.strength, "strength", "攻撃力")}
            {statusNumberInput(props.items.defence, "defence", "防御力")}
            {props.items.gold !== undefined &&
                statusNumberInput(props.items.gold, "gold", "所持金")
            }
        </>
    );
};

/**
 * URL を入力するテキストボックスです。
 *     後述の StringInput と内容は共通ですが、今後 URL 入力だけ仕様変更が出来るように別に独立しています。
 *     テキストボックスには type="url" と指定していませんが、これは相対パスの文字列でも検出出来るようにするためです。
 */
export const URLInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="text"
            value={props.value}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

export const StringInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="text"
            value={props.value}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

/**
 * 一部の物体パーツの編集画面に付いている「サウンド番号」「動作属性」「メッセージ」の3つの入力欄をセットにしたコンポーネントです。
 */
export const ObjectCommonInput: React.FunctionComponent<{
    messageLabel: string,
    soundValue: number,
    moveValue: number,
    messageValue: string,
    onSoundChange: InputChangeFunction,
    onMoveChange: InputChangeFunction,
    onMessageChange: InputChangeFunction
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
