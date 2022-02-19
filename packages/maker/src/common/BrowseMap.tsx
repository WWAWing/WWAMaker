import React from "react";
import { useState } from "react";
import { RelativeValue } from "./convertRelativeValue";
import BrowseModal from "./BrowseModal";
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

    return (
        <BrowseModal
            isOpen={props.isOpen}
            title="マップ座標を選択"
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
