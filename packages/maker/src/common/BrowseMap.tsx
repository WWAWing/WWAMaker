import React from "react";
import { useState } from "react";
import { RelativeValue } from "./convertRelativeValue";
import makeBrowseModal from "./makeBrowseModal";
import MapView from "./MapView";

const BrowseMap: React.FC<{
    isOpen: boolean,
    onSubmit: (x: RelativeValue, y: RelativeValue) => void,
    onClose: () => void
}> = props => {

    const [hoveringX, hoverX] = useState(0);
    const [hoveringY, hoverY] = useState(0);

    const [selectingX, selectX] = useState(0);
    const [selectingY, selectY] = useState(0);

    const BrowseModal = makeBrowseModal("マップ座標を選択");

    // FIXME: マップ内でカーソルを移動するたびに再描画が頻発していて遅い
    return (
        <BrowseModal
            isOpen={props.isOpen}
            onSubmit={() => {
                props.onSubmit({
                    type: "ABSOLUTE",
                    value: selectingX
                }, {
                    type: "ABSOLUTE",
                    value: selectingY
                });
            }}
            onClose={props.onClose}
        >
            <div>
                X: {hoveringX}, Y: {hoveringY}
            </div>
            <div style={{ height: "60vh" }}>
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
        </BrowseModal>
    );
};

export default BrowseMap;
