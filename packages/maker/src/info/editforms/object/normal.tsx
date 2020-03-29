import React from "react";
import { PartsEditPropsWithoutMessage } from "../PartsEditProps";
import WWAConsts from "../../../classes/WWAConsts";

/**
 * 「通常物体」パーツの編集画面です。
 */
export const ObjectNormalEditForm: React.StatelessComponent<PartsEditPropsWithoutMessage> = params => {
    return (
        <div>
            <div>通行区分: {params.attribute[WWAConsts.ATR_MODE]}</div>
            <div>動作属性: {params.attribute[WWAConsts.ATR_MOVE]}</div>
        </div>
    );
};
