import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import MapView from "../common/MapView";

const BrowseMap: React.FC = () => {
    const map = useSelector(state => state.wwaData?.map);
    const mapObject = useSelector(state => state.wwaData?.mapObject);

    const [hoveringX, hoverX] = useState(0);
    const [hoveringY, hoverY] = useState(0);

    const [selectingX, selectX] = useState(0);
    const [selectingY, selectY] = useState(0);

    if (!map || !mapObject) {
        // FIXME: 多分異常時での発生なのでエラーメッセージとか表示するようにしたい
        return null;
    }

    // TODO: 横幅の指定が適当なので直したい
    return (
        <>
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
                />
            </div>
            <div>
                X: {selectingX}, Y: {selectingY}
            </div>
        </>
    );
};

export default BrowseMap;
