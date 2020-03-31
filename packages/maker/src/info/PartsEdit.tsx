import { MapStateToProps, connect } from "react-redux";
import { InfoPanelPartsEditState } from "./InfoPanelState";
import { StoreType } from "../State";
import { WWAData } from "@wwawing/common-interface";
import { Dispatch, bindActionCreators } from "redux";
import { editParts } from "../wwadata/WWADataState";
import React from "react";
import { PartsType } from "../classes/WWAData";
import WWAConsts from "../classes/WWAConsts";
import * as ObjectEditForm from "./editforms/ObjectEditForm";
import * as MapEditForm from "./editforms/MapEditForm";
import { LocalGateEdit, URLGateEdit } from "./editforms/CommonEditForm";

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
 *     message はパーツのメッセージです。
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

        /**
         * 予め子コンポーネントに渡すメソッドに対して this を bind します。
         */
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.state !== prevProps.state) {
            this.setState(this.receive());
        }
    }

    /**
     * Redux のステートからパーツ情報を出力します。
     */
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

    /**
     * 入力画面のステートを Redux のステートにも反映させます。
     */
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
    private handleAttributeChange(value: string, attributeIndex: number) {
        let newAttribute = this.state.attribute?.slice();
        if (newAttribute === undefined) {
            return;
        }
        newAttribute[attributeIndex] = parseInt(value);

        this.setState({
            attribute: newAttribute
        });
    }

    /**
     * @see PartsEditMessageChange
     */
    private handleMessageChange(value: string) {
        if (this.state.message === undefined) {
            return;
        }
        
        this.setState({
            message: value
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
            const attribute = this.state.attribute;
            const message = this.state.message;

            switch (attribute[WWAConsts.ATR_TYPE]) {
                case WWAConsts.MAP_STREET:
                    return MapEditForm.MapStreetEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.MAP_WALL:
                    return MapEditForm.MapWallEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.MAP_LOCALGATE:
                    return LocalGateEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.MAP_URLGATE:
                    return URLGateEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
            }

        } else if (this.props.state.type === PartsType.OBJECT) {
            const attribute = this.state.attribute;
            const message = this.state.message;

            switch (attribute[WWAConsts.ATR_TYPE]) {
                case WWAConsts.OBJECT_NORMAL:
                    return ObjectEditForm.ObjectNormalEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_MESSAGE:
                    return ObjectEditForm.ObjectMessageEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_MONSTER:
                    return ObjectEditForm.ObjectMonsterEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_ITEM:
                    return ObjectEditForm.ObjectItemEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_DOOR:
                    return ObjectEditForm.ObjectDoorEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_STATUS:
                    return ObjectEditForm.ObjectStatusEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_SELL:
                    return ObjectEditForm.ObjectSellItemEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_BUY:
                    return ObjectEditForm.ObjectBuyItemEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_URLGATE:
                    return URLGateEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_SCORE:
                    return ObjectEditForm.ObjectScoreEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_RANDOM:
                    return ObjectEditForm.ObjectRandomEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_SELECT:
                    // TODO: 二者択一の場合は指定位置にパーツを出現の表示が別になるため、そうなるように考慮しておく
                    return ObjectEditForm.ObjectSelectEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
                case WWAConsts.OBJECT_LOCALGATE:
                    return LocalGateEdit(attribute, message, this.handleAttributeChange, this.handleMessageChange);
            }
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
