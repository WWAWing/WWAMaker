import React, { useEffect } from "react";
import { useState } from "react";
import { RelativeValue } from "./convertRelativeValue";
import BrowseModal from "./BrowseModal";
import MapView from "./MapView";
import { Dropdown, Form, Icon, Input, Label, List, StrictFormFieldProps, StrictIconProps, Tab } from "semantic-ui-react";
import { useSelector } from "react-redux";
import WWAConsts from "../classes/WWAConsts";

type BrowseMapPaneComponent = React.FC<{
    value: { x: RelativeValue, y: RelativeValue },
    onChange: (x: RelativeValue, y: RelativeValue) => void,
}>;

const AbsoluteBrowseMap: BrowseMapPaneComponent = ({ value, onChange }) => {

    const [hoveringX, hoverX] = useState(0);
    const [hoveringY, hoverY] = useState(0);

    const selectingX = value.x.type !== "ABSOLUTE" ? 0 : value.x.value;
    const selectingY = value.y.type !== "ABSOLUTE" ? 0 : value.y.value;

    return (
        <>
            <Label.Group>
                <Label>
                    X
                    <Label.Detail>{hoveringX}</Label.Detail>
                </Label>
                <Label>
                    Y
                    <Label.Detail>{hoveringY}</Label.Detail>
                </Label>
            </Label.Group>
            <div style={{ height: "45vh" }}>
                <MapView
                    onMouseDown={(x, y) => {
                        onChange(
                            { type: "ABSOLUTE", value: x },
                            { type: "ABSOLUTE", value: y }
                        );
                    }}
                    onMouseDrag={() => {}}
                    onMouseMove={(x, y) => {
                        hoverX(x);
                        hoverY(y);
                    }}
                    onMouseUp={() => {}}
                    selectRect={{
                        chipX: selectingX,
                        chipY: selectingY,
                        chipWidth: 1,
                        chipHeight: 1
                    }}
                />
            </div>
            <Label.Group>
                選択中の座標は
                <Label>
                    X
                    <Label.Detail>{selectingX}</Label.Detail>
                </Label>
                <Label>
                    Y
                    <Label.Detail>{selectingY}</Label.Detail>
                </Label>
            </Label.Group>
        </>
    );
};

 const CoordInput: React.FunctionComponent<{
    label?: string,
    width?: StrictFormFieldProps["width"],
    value: RelativeValue,
    onChange: (changedValue: RelativeValue) => void;
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

    /**
     * mapWidth はマップのサイズそのままです。
     */
    const mapWidthMax = useSelector(state => state.wwaData?.mapWidth) ?? 0;

    /**
     * 座標の種別で表示されるラベル部分のコンポーネントです。
     */
    const PartsTypeDropdownLabel = () => {
        const coordOption = coordOptions.find(value => props.value.type === value.value);
        return (
            <>
                <Icon name={coordOption?.icon} />
                {coordOption?.text}
            </>
        );
    };

    /**
     * 座標の最小値を指定します。
     */
    const getCoordMin = () => {
        if (props.value.type === "RELATIVE") {
            return -WWAConsts.RELATIVE_COORD_MAX;
        } else if (props.value.type === "ABSOLUTE") {
            return 0;
        }
        return undefined;
    };

    /**
     * 座標の最大値を指定します。
     */
    const getCoordMax = () => {
        if (props.value.type === "RELATIVE") {
            return WWAConsts.RELATIVE_COORD_MAX;
        } else if (props.value.type === "ABSOLUTE") {
            return mapWidthMax;
        }
        return undefined;
    };

    return (
        <Form.Field width={props.width}>
            {props.label !== undefined &&
                <label>{props.label}</label>
            }
            <Input
                action={
                    <Dropdown
                        button
                        basic
                        compact
                        options={coordOptions}
                        value={props.value.type}
                        trigger={<PartsTypeDropdownLabel />}
                        onChange={(event, { value }) => {
                            const relativeValue = {
                                type: value as RelativeValue["type"],
                                value: props.value.type === "PLAYER" ? 0 : props.value.value
                            };
                            props.onChange(relativeValue);
                        }}
                    />
                }
                actionPosition="left"
                type="number"
                value={props.value.type !== "PLAYER" ? props.value.value : ""}
                min={getCoordMin()}
                max={getCoordMax()}
                onChange={(event, { value }) => {
                    if (props.value.type === "PLAYER") {
                        return;
                    }
                    // 空欄のように、 parseInt では NaN になる値は 0 にリセット
                    const parsedValue = parseInt(value);
                    const relativeValue = {
                        ...props.value,
                        value: Number.isNaN(parsedValue) ? 0 : parsedValue
                    };
                    props.onChange(relativeValue);
                }}
            />
        </Form.Field>
    );
};

const ManualBrowseMap: BrowseMapPaneComponent = ({ value, onChange }) => {
    return (
        <Form.Group>
            <div style={{ height: "30vh" }}>
                <List horizontal>
                    <List.Item>
                        <CoordInput
                            value={value.x}
                            onChange={(changedValue) => {
                                onChange(changedValue, value.y);
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <CoordInput
                            value={value.y}
                            onChange={(changedValue) => {
                                onChange(value.x, changedValue);
                            }}
                        />
                    </List.Item>
                </List>
            </div>
        </Form.Group>
    );
};

const BrowseMap: React.FC<{
    isOpen: boolean,
    defaultValue: { x: RelativeValue, y: RelativeValue },
    onSubmit: (x: RelativeValue, y: RelativeValue) => void,
    onClose: () => void
}> = props => {

    const [selectingX, selectX] = useState<RelativeValue>(props.defaultValue.x);
    const [selectingY, selectY] = useState<RelativeValue>(props.defaultValue.y);

    const onChange = (x: RelativeValue, y: RelativeValue) => {
        selectX(x);
        selectY(y);
    };

    useEffect(() => {
        if (props.isOpen) {
            selectX(props.defaultValue.x);
            selectY(props.defaultValue.y);
        }
    // eslint-disable-next-line
    }, [props.isOpen]);

    return (
        <BrowseModal
            isOpen={props.isOpen}
            title="マップ座標を選択"
            onSubmit={() => {
                props.onSubmit(selectingX, selectingY);
            }}
            onClose={props.onClose}
        >
            <Tab panes={[
                {
                    menuItem: {
                        key: "absolute",
                        icon: "map",
                        content: "マップから参照",
                    },
                    render: () => (
                        <Tab.Pane>
                            <AbsoluteBrowseMap
                                onChange={onChange}
                                value={{ x: selectingX, y: selectingY }}
                            />
                        </Tab.Pane>
                    )
                },
                {
                    menuItem: {
                        key: "manual",
                        icon: "pencil",
                        content: "手動で入力",
                    },
                    render: () => (
                        <Tab.Pane>
                            <ManualBrowseMap
                                onChange={onChange}
                                value={{ x: selectingX, y: selectingY }}
                            />
                        </Tab.Pane>
                    )
                }
            ]} />
        </BrowseModal>
    );
};

export default BrowseMap;
