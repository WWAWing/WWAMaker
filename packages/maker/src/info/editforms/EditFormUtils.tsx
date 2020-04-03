import React from "react";
import WWAConsts from "../../classes/WWAConsts";
import { MoveType } from "../../classes/WWAData";

// このファイルはパーツ編集画面で頻繁に使用されるテキストボックスやセレクトボックスなどをまとめたコンポーネント集です。

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
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = props => (
    <div>
        {props.label}
        <input type="number" value={props.value} onChange={props.onChange} />
    </div>
);

/**
 * 数字を入力するコンポーネントを作成します。
 */
const createNumberInput = (label: string) => {
    return (props: {
        value: number,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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
    selectableItems: NumberEditFormItem[],
    value: number,
    label: string,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}> = props => (
    <div>
        {props.label}
        <select defaultValue={props.value} onChange={props.onChange}>
            {props.selectableItems.map((option, optionIndex) =>
                <option key={optionIndex} value={option.value}>
                    {option.label}
                </option>
            )}
        </select>
    </div>
);

/**
 * セレクトボックスのコンポーネントを作成します。
 */
const createSelectInput = (label: string, selectableItems: { label: string, value: number }[]) => {
    return (props: {
        value: number,
        onChange: (event: React.ChangeEvent<HTMLSelectElement> ) => void
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
        label: "静止",
        value: MoveType.STATIC,
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
]);
export const PassableInput = createSelectInput("通行区分", [
    {
        label: "通行不可",
        value: 0
    }, {
        label: "通行可",
        value: WWAConsts.PASSABLE_OBJECT
    }
]);

export const MessageInput: React.FunctionComponent<{
    value: string,
    label: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}> = props => (
    <div>
        <div>{props.label}</div>
        <textarea value={props.value} onChange={props.onChange} />
    </div>
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
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = props => (
    <>
        {props.items.energy !== undefined &&
            <div>
                {props.items.energy.label !== undefined ? props.items.energy.label : "生命力"}
                <input type="number" name="energy" value={props.items.energy.value} onChange={props.onChange}></input>
            </div>
        }
        <div>
            {props.items.strength.label !== undefined ? props.items.strength.label : "攻撃力"}
            <input type="number" name="strength" value={props.items.strength.value} onChange={props.onChange}></input>
        </div>
        <div>
            {props.items.defence.label !== undefined ? props.items.defence.label : "防御力"}
            <input type="number" name="defence" value={props.items.defence.value} onChange={props.onChange}></input>
        </div>
        {props.items.gold !== undefined &&
            <div>
                {props.items.gold.label !== undefined ? props.items.gold.label : "所持金"}
                <input type="number" name="gold" value={props.items.gold.value} onChange={props.onChange}></input>
            </div>
        }
    </>
);

export const URLInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = props => (
    <div>
        <div>{props.label}</div>
        <input type="text" value={props.value} onChange={props.onChange}></input>
    </div>
);

export const StringInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = props => (
    <div>
        {props.label}
        <input type="text" value={props.value} onChange={props.onChange}></input>
    </div>
);
