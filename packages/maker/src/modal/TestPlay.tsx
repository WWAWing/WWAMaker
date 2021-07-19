import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TestPlay: React.FC<{}> = () => {
    const wwaData = useSelector(state => state.wwaData);
    const absolutePath = useSelector(state => state.load?.currentFilePath);
    const [testplayUrl, setTestPlayUrl] = useState<string>("");

    useEffect(() => {
        if (wwaData === null) {
            return;
        }
        ipcRenderer.send('testplay', {
            wwaData,
            absolutePath
        });
        ipcRenderer.once('testplay-return-url', (event, data) => {
            if (!data.url) {
                throw new Error("テストプレイの結果から URL が取得できませんでした。");
            }
            setTestPlayUrl(data.url);
        });
    }, [wwaData, absolutePath]);

    if (wwaData === null) {
        return null;
    }
    if (testplayUrl.length <= 0) {
        return null;
    }

    // TODO: 横幅と縦幅は定数を使用して求めるようにしたい
    return (
        <iframe src={testplayUrl} title={wwaData.worldName} width="800" height="600" />
    );
};

export default TestPlay;
