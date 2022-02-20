import React from "react";
import { Input, Form } from "semantic-ui-react";
import { InputChangeFunction } from "./definitions";

export const NumberInput: React.FunctionComponent<{
    value: number;
    label: string;
    name?: string;
    min?: number;
    max?: number;
    onChange: InputChangeFunction;
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="number"
            name={props.name}
            value={props.value}
            min={props.min}
            max={props.max}
            onChange={(event, data) => {
                props.onChange(data.value);
            }} />
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
