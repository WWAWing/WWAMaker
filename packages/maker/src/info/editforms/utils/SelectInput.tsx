import React from "react";
import { Dropdown, DropdownItemProps, Form } from "semantic-ui-react";
import WWAConsts from "../../../classes/WWAConsts";
import { MoveType } from "../../../classes/WWAData";
import { InputChangeFunction } from "./definitions";

export const SelectInput: React.FunctionComponent<{
    selectableItems: DropdownItemProps[];
    value: number;
    label: string;
    onChange: InputChangeFunction;
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Dropdown
            options={props.selectableItems}
            value={props.value}
            selection
            onChange={(event, data) => {
                if (data.value === undefined) {
                    return;
                }
                const value = data.value as string;
                props.onChange(value);
            }} />
    </Form.Field>
);

/**
 * セレクトボックスのコンポーネントを作成します。
 */
export const createSelectInput = (label: string, selectableItems: DropdownItemProps[]) => {
    return (props: {
        value: number;
        onChange: InputChangeFunction;
    }) => (
        <SelectInput
            label={label}
            selectableItems={selectableItems}
            value={props.value}
            onChange={props.onChange} />
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
