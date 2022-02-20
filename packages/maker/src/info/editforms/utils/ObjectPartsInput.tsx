import React from "react";
import { Form, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import { ObjectPartsBrowse } from "../../../common/BrowseParts";
import { InputChangeFunction } from "./definitions";

/**
 * 物体パーツ番号の参照機能が付いた入力コンポーネントです。
 */
export const ObjectPartsInput: React.FC<{
    value: number;
    label?: string;
    onChange: InputChangeFunction;
}> = props => {
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);

    return (
        <Form.Field>
            {props.label &&
                <label>{props.label}</label>}
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
            <ObjectPartsBrowse
                isOpen={isBrowseOpen}
                onClose={() => {
                    setIsBrowseOpen(false);
                }}
                onSubmit={(partsNumber) => {
                    props.onChange(partsNumber.toString());
                }}
                selectingPartsNumber={props.value} />
        </Form.Field>
    );
};
