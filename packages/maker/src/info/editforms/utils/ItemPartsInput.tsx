import React from "react";
import { Form, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import { ItemPartsBrowse } from "../../../common/BrowseParts";
import { InputChangeFunction } from "./definitions";

/**
 * アイテムパーツ番号の参照機能が付いた入力コンポーネントです。
 */
export const ItemPartsInput: React.FC<{
    value: number;
    label: string;
    onChange: InputChangeFunction;
}> = props => {
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);

    return (
        <Form.Field>
            <label>{props.label}</label>
            <Label>
                {props.value}
            </Label>
            <Button
                onClick={() => {
                    setIsBrowseOpen(true);
                }}
            >
                参照
            </Button>
            <ItemPartsBrowse
                isOpen={isBrowseOpen}
                onClose={() => {
                    setIsBrowseOpen(false);
                }}
                onSubmit={(partsNumber) => {
                    props.onChange(partsNumber.toString());
                }}
                selectingPartsNumber={props.value}
            />
        </Form.Field>
    );
};
