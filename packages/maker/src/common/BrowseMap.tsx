import React from "react";
import { useState } from "react";
import { RelativeValue } from "./convertRelativeValue";
import BrowseModal from "./BrowseModal";
import MapView from "./MapView";
import { Form, Label, List, Tab } from "semantic-ui-react";
import { CoordInput } from "../info/editforms/EditFormUtils";

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

const ManualBrowseMap: BrowseMapPaneComponent = ({ value, onChange }) => {
    return (
        <Form.Group>
            <div style={{ height: "30vh" }}>
                <List horizontal>
                    <List.Item>
                        <CoordInput
                            value={value.x}
                            onChange={() => {
                                // onChange は引数が変換後の値で使用できないので未使用
                            }}
                            onChangeRaw={(changedValue) => {
                                onChange(changedValue, value.y);
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <CoordInput
                            value={value.y}
                            onChange={() => {
                                // onChange は引数が変換後の値で使用できないので未使用
                            }}
                            onChangeRaw={(changedValue) => {
                                onChange(value.x, changedValue);
                            }}
                        />
                    </List.Item>
                </List>
            </div>
        </Form.Group>
    );
};

/**
 * @todo 座標の初期値を設定するようにする
 */
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
