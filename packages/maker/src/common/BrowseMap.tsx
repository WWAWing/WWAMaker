import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Message, Modal } from "semantic-ui-react";
import { RelativeValue } from "./convertRelativeValue";
import MapView from "./MapView";

const BrowseMap: React.FC<{
    isOpen: boolean,
    onSubmit: (x: RelativeValue, y: RelativeValue) => void,
    onClose: () => void
}> = props => {
    const map = useSelector(state => state.wwaData?.map);
    const mapObject = useSelector(state => state.wwaData?.mapObject);

    const [hoveringX, hoverX] = useState(0);
    const [hoveringY, hoverY] = useState(0);

    const [selectingX, selectX] = useState(0);
    const [selectingY, selectY] = useState(0);

    if (!map || !mapObject) {
        return (
            <Modal open={props.isOpen} onClose={props.onClose}>
                <Modal.Header>マップ座標を選択</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Message negative>
                            <Message.Header>マップ情報が取得できませんでした。</Message.Header>
                            <p>マップデータファイルを開いているか確認してください。</p>
                        </Message>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }

    // TODO: 横幅の指定が適当なので直したい
    return (
        <Modal open={props.isOpen} onClose={props.onClose}>
            <Modal.Header>マップ座標を選択</Modal.Header>
            <Modal.Content scrolling>
                <div>
                    X: {hoveringX}, Y: {hoveringY}
                </div>
                <div style={{ height: "100vh" }}>
                    <MapView
                        onMouseDown={(x, y) => {
                            selectX(x);
                            selectY(y);
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
                <div>
                    X: {selectingX}, Y: {selectingY}
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    primary
                    onClick={() => {
                        props.onSubmit({
                            type: "ABSOLUTE",
                            value: selectingX
                        }, {
                            type: "ABSOLUTE",
                            value: selectingY
                        });
                        props.onClose();
                    }}
                >決定</Button>
                <Button
                    secondary
                    onClick={() => props.onClose()}
                >キャンセル</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default BrowseMap;
