import WWAConsts from "../../classes/WWAConsts"
import { ObjectNormalEditForm } from "./object/normal"
import React from "react";
import { PartsEditPropsWithMessage } from "./PartsEditProps";

interface Props {
    partsNumber: number;
    partsInfo: PartsEditPropsWithMessage;
}

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const ObjectEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        switch (props.partsInfo.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.OBJECT_NORMAL:
                return <ObjectNormalEditForm attribute={props.partsInfo.attribute}></ObjectNormalEditForm>;
        }
        return <></>;
    }

    return ( // TODO: グラフィック画像を表示する
        <div>
            <div>物体パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    )
}
