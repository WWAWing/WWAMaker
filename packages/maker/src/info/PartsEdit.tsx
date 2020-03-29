import { MapStateToProps, connect } from "react-redux";
import { InfoPanelPartsEditState } from "./InfoPanelState";
import { StoreType } from "../State";
import { WWAData } from "@wwawing/common-interface";
import { Dispatch, bindActionCreators } from "redux";
import { editParts } from "../wwadata/WWADataState";
import React from "react";
import { PartsType } from "../classes/WWAData";
import { ObjectEditForm } from "./editforms/ObjectEditForm";
import WWAConsts from "../classes/WWAConsts";
import { MapEditForm } from "./editforms/MapEditForm";

interface StateProps {
    /**
     * 開いているパーツの種類と番号です。
     */
    state?: InfoPanelPartsEditState,
    /**
     * WWAデータ本体です。上記の state の値から必要な情報をこの wwaData の中から探します。
     */
    wwaData?: WWAData
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        state: state.info.partsEdit,
        wwaData: state.wwaData || undefined
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        editParts: editParts
    }, dispatch);
};

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

/**
 * パーツ編集の管理を行う Container コンポーネントです。
 *     編集フォームは、パーツ種別毎に用意した専用のコンポーネントを取り出して表示されます。
 */
class PartsEdit extends React.Component<Props> {

    /**
     * 編集フォームを取得します。
     */
    getEditForm() {
        if (this.props.state === undefined || this.props.wwaData === undefined) {
            return <></>;
        }

        if (this.props.state.type === PartsType.MAP) {
            const attribute = this.props.wwaData.mapAttribute[this.props.state.number];
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return (
                <MapEditForm
                    partsNumber={this.props.state.number}
                    partsInfo={{ attribute: attribute, message: message }}
                ></MapEditForm>
            )
        } else if (this.props.state.type === PartsType.OBJECT) {
            const attribute = this.props.wwaData.objectAttribute[this.props.state.number];
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return (
                <ObjectEditForm
                    partsNumber={this.props.state.number}
                    partsInfo={{ attribute: attribute, message: message }}
                ></ObjectEditForm>
            );
        }

        return <></>;
    }

    render() {
        return (
            <div>
                {this.getEditForm()}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartsEdit);
