import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Saver from "wwamaker-saver";
// TODO: まだ動きません！！
// import "@wwawing/engine";
// import "@wwawing/styles";

const TestPlay: React.FC<{}> = () => {
    const wwadata = useSelector(state => state.wwaData);
    const [mapdataUrl, updateWWADataUrl] = useState<string>("");

    useEffect(() => {
        if (wwadata === null) {
            return;
        }
        Saver(wwadata).then(data => {
            const blob = new Blob([ data ]);
            updateWWADataUrl(URL.createObjectURL(blob));
        });
    }, [wwadata]);

    if (wwadata === null) {
        return null;
    }
    if (mapdataUrl.length <= 0) {
        return null;
    }

    return (
        <div
            id="wwa-wrapper"
            className="wwa-size-box"
            data-wwa-mapdata={mapdataUrl}
        >
        </div>
    );
};

export default TestPlay;
