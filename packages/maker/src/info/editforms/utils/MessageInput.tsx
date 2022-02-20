import React from "react";
import { Form, TextArea } from "semantic-ui-react";
import { InputChangeFunction } from "./definitions";

export const MessageInput: React.FunctionComponent<{
    value: string;
    label: string;
    onChange: InputChangeFunction;
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
            }} />
    </Form.Field>
);
