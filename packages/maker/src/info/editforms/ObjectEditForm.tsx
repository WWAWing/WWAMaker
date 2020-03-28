import WWAConsts from "../../classes/WWAConsts"
import { ObjectNormalEditForm } from "./object/normal"
import React from "react";

interface Props {
    partsNumber: number;
    attribute: number[];
    message?: string;
}

/**
 * 物体パーツの編集フォームのコンポーネントです。
 */
export const ObjectEditForm: React.StatelessComponent<Props> = props => {
    const getEditForm = () => {
        switch (props.attribute[WWAConsts.ATR_TYPE]) {
            case WWAConsts.OBJECT_NORMAL:
                return <ObjectNormalEditForm attribute={props.attribute}></ObjectNormalEditForm>;
        }
        return <></>;
    }

    return (
        <div>
            <div>物体パーツ: {props.partsNumber} 番</div>
            {getEditForm()}
        </div>
    )
}

