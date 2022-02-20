import React from "react";
import { Input, Form } from "semantic-ui-react";
import { InputChangeFunction } from "./definitions";

/**
 * URL を入力するテキストボックスです。
 *     後述の StringInput と内容は共通ですが、今後 URL 入力だけ仕様変更が出来るように別に独立しています。
 *     テキストボックスには type="url" と指定していませんが、これは相対パスの文字列でも検出出来るようにするためです。
 */
export const URLInput: React.FunctionComponent<{
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
            }} />
    </Form.Field>
);
