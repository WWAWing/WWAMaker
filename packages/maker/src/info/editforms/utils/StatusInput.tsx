import React from "react";
import { convertRelativeValueFromStatus, convertDataValueFromRelativeStatus } from "../../../common/convertRelativeValue";
import { InputChangeFunctionWithName } from "./definitions";
import { NumberInput } from "./NumberInput";

/**
 * パーツ編集で必要になるステータス入力値のうち、ステータス1つ分で必要なプロパティを示す型です。
 */
type NumberEditFormItem = {
    label?: string;
    value: number;
};

/**
 * モンスターやアイテムで使用するステータス入力欄です。
 *     「ステータス変化」といった負の値を扱うステータス入力欄と、「モンスター」や「アイテム」といった正の値しか扱わないステータス入力欄を分けるため、作成するメソッドを予め用意しています。
 * @param min 最小値
 * @param max 最大値
 * @param getValue NumberInput コンポーネントに値を渡す際に実行するメソッド
 * @param setValue NumberInput コンポーネントで入力した値からプロパティの onChange メソッドに渡す際に実行するメソッド
 */
function createStatusInput(
    min: number,
    max: number,
    getValue: (value: number) => number,
    setValue: (value: string) => string
): React.FC<{
    items: {
        energy?: NumberEditFormItem;
        strength: NumberEditFormItem;
        defence: NumberEditFormItem;
        gold?: NumberEditFormItem;
    };
    onChange: InputChangeFunctionWithName;
}> {
    /**
     * @param props 下記の情報を含めた連想配列
     *
     *     items: energy, strength, defence, gold の情報
     *     label の指定がない場合はそれぞれ 生命力、攻撃力、防御力、所持金 になります。
     *
     *     onChange: 入力欄が変更した場合に発生するメソッド
     *     どのテキストボックから入力されたかは、 event.target.name から確認できます。
     */
    return (props) => {

        const statusNumberInput = (item: NumberEditFormItem, name: string, defaultLabel: string) => (
            <NumberInput
                label={item.label !== undefined ? item.label : defaultLabel}
                min={min}
                max={max}
                onChange={value => props.onChange(setValue(value), name)}
                name={name}
                value={getValue(item.value)} />
        );

        return (
            <>
                {props.items.energy !== undefined &&
                    statusNumberInput(props.items.energy, "energy", "生命力")}
                {statusNumberInput(props.items.strength, "strength", "攻撃力")}
                {statusNumberInput(props.items.defence, "defence", "防御力")}
                {props.items.gold !== undefined &&
                    statusNumberInput(props.items.gold, "gold", "所持金")}
            </>
        );
    };
}

/**
 * 正の値しか扱わないステータス入力欄
 */

export const StatusInput = createStatusInput(0, 60000, value => value, value => value);

/**
 * 正の値と負の値を扱うステータス入力欄
 */
export const AdjustStatusInput = createStatusInput(
    -30000,
    30000,
    value => convertRelativeValueFromStatus(value),
    value => convertDataValueFromRelativeStatus(parseInt(value)).toString()
);
