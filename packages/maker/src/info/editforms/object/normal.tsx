import React from "react";

type Params = {
    attribute: number[]
}

export const ObjectNormalEditForm: React.StatelessComponent<Params> = params => {
    return (
        <div>
            <div>通行区分</div>
            <div>動作属性</div>
        </div>
    );
};
