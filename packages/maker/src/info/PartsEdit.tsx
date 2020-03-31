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
 * パーツ編集画面のステートです。
 *     attribute はパーツの属性そのままです。
 *     message はパーツのメッセージですが、通常物体の場合は持たず、URLゲートの場合は複数文字列を扱う形になります。
 * @todo パーツ種別毎に型を指定出来るようにしたい
 */
interface PartsEditState {
    attribute?: number[];
    message?: string;
}

/**
 * パーツ編集の管理を行う Container コンポーネントです。
 *     編集フォームは、パーツ種別毎に用意した専用のコンポーネントを取り出して表示されます。
 */
class PartsEdit extends React.Component<Props, PartsEditState> {

    constructor(props: Props) {
        super(props);
        this.state = this.receive();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.state !== prevProps.state) {
            this.setState(this.receive());
        }
    }

    private receive(): PartsEditState {
        if (this.props.state === undefined || this.props.wwaData === undefined) {
            return {};
        }

        if (this.props.state.type === PartsType.MAP) {
            const attribute = this.props.wwaData.mapAttribute[this.props.state.number];
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return {
                attribute: attribute,
                message: message
            };
        } else if (this.props.state.type === PartsType.OBJECT) {
            const attribute = this.props.wwaData.objectAttribute[this.props.state.number];
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return {
                attribute: attribute,
                message: message
            };
        }

        return {};
    }

    private send() {
        if (this.props.state === undefined ||
            this.state.attribute === undefined ||
            this.state.message === undefined
        ) {
            return;
        }
        
        this.props.editParts({
            type: this.props.state.type,
            number: this.props.state.number,
            attributes: this.state.attribute,
            message: this.state.message
        });
    }

    /**
     * @see PartsEditAttributeChange
     */
    private handleAttributeChange(attributeIndex: number, value: number) {
        let newAttribute = this.state.attribute?.slice();
        if (newAttribute === undefined) {
            return;
        }
        newAttribute[attributeIndex] = value;

        this.setState({
            attribute: newAttribute
        });
    }

    /**
     * @see PartsEditMessageChange
     */
    private handleMessageChange(message: string) {
        if (this.state.message === undefined) {
            return;
        }

        this.setState({
            message: message
        });
    }

    /**
     * 編集フォームを取得します。
     */
    getEditForm() {
        if (
            this.props.state === undefined ||
            this.state.attribute === undefined ||
            this.state.message === undefined
        ) {
            return <p>WWAデータがありません。マップデータを開いてください。</p>;
        }

        if (this.props.state.type === PartsType.MAP) {
            return (
                <MapEditForm
                    partsNumber={this.props.state.number}
                    partsInfo={{ attribute: this.state.attribute, message: this.state.message }}
                    onAttributeChange={this.handleAttributeChange.bind(this)}
                    onMessageChange={this.handleMessageChange.bind(this)}
                ></MapEditForm>
            )
        } else if (this.props.state.type === PartsType.OBJECT) {
            return (
                <ObjectEditForm
                    partsNumber={this.props.state.number}
                    partsInfo={{ attribute: this.state.attribute, message: this.state.message }}
                ></ObjectEditForm>
            );
        }

        return <p>対応したパーツ編集画面が見つかりませんでした。</p>;
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
