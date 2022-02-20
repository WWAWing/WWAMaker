import React from "react";
import { Input, Form } from "semantic-ui-react";
import { InputChangeFunction } from "./definitions";

export const StringInput: React.FunctionComponent<{
    label: string;
    value: string;
    onChange: InputChangeFunction;
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
