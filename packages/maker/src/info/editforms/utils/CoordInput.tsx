import React, { useState } from "react";
import { Form, Icon, StrictIconProps, Label, Button } from "semantic-ui-react";
import { RelativeValue, convertDataValueFromRelativeCoord } from "../../../common/convertRelativeValue";
import BrowseMap from "../../../common/BrowseMap";
import { CoordInputChangeFunction } from "./definitions";

/**
 * 座標を入力あるいは参照するコンポーネントです。
 */
export const CoordInput: React.FC<{
    label?: string,
    x: RelativeValue,
    y: RelativeValue,
    onSubmit: CoordInputChangeFunction,
}> = props => {

    /**
     * coordOptions は座標の種別を選択するドロップダウンの項目定数です。
     */
    const coordOptions: { text: string, value: RelativeValue["type"], icon: StrictIconProps["name"] }[] = [{
        text: "絶対",
        value: "ABSOLUTE",
        icon: "point"
    }, {
        text: "相対",
        value: "RELATIVE",
        icon: "arrows alternate"
    }, {
        text: "プレイヤー",
        value: "PLAYER",
        icon: "user"
    }];

    const [isBrowseOpen, setBrowseOpen] = useState(false);

    const ValueLabel: React.FC<{ name: string, value: RelativeValue }> = ({ name, value }) => {
        const coordOption = coordOptions.find(options => options.value === value.type);
        return (
            <Label>
                {name}
                <Label.Detail>
                    <Icon name={coordOption?.icon} />
                    {value.type !== "PLAYER" && value.value}
                </Label.Detail>
            </Label>
        );
    }

    return (
        <Form.Field>
            <ValueLabel name="X" value={props.x} />
            <ValueLabel name="Y" value={props.y} />
            <Button onClick={() => setBrowseOpen(true)}>参照</Button>
            <BrowseMap
                isOpen={isBrowseOpen}
                defaultValue={{ x: props.x, y: props.y }}
                onSubmit={(x, y) => {
                    // TODO: 空欄の値では NaN が入ってくる可能性がある
                    props.onSubmit(
                        convertDataValueFromRelativeCoord(x).toString(),
                        convertDataValueFromRelativeCoord(y).toString()
                    );
                }}
                onClose={() => setBrowseOpen(false)}
            />
        </Form.Field>
    );
};
