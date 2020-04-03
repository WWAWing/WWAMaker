import { MapStateToProps, connect } from "react-redux";
import { InfoPanelPartsEditState, switchInfoPanel } from "./InfoPanelState";
import { StoreType } from "../State";
import { WWAData } from "@wwawing/common-interface";
import { Dispatch, bindActionCreators } from "redux";
import { editParts } from "../wwadata/WWADataState";
import React from "react";
import { PartsType } from "../classes/WWAData";
import WWAConsts from "../classes/WWAConsts";
import { ObjectEditTable } from "./editforms/ObjectEditForm";
import { MapEditTable } from "./editforms/MapEditForm";
import { PartsEditComponentTable } from "./editforms/PartsEditComponent";

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
        editParts: editParts,
        switchInfoPanel: switchInfoPanel
    }, dispatch);
};

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

/**
 * パーツ編集画面のステートです。
 *     attribute はパーツの属性そのままです。
 *     message はパーツのメッセージです。
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

    private handleEditButtonClick() {
        this.send();
        this.props.switchInfoPanel({ mode: "MAP_FOUNDATION" });
    }

    private handleCancelButtonClick() {
        this.props.switchInfoPanel({ mode: "MAP_FOUNDATION" });
    }

    /**
     * パーツ種別対応表の変数を取得します。
     */
    private getPartsEditTable(): PartsEditComponentTable | null {
        if (this.props.state === undefined) {
            return null;
        }
        if (this.props.state.type === PartsType.MAP) {
            return MapEditTable;
        } else if (this.props.state.type === PartsType.OBJECT) {
            return ObjectEditTable;
        }

        return null;
    }

    /**
     * パーツ種別を変更するセレクトボックスを出力します。
     */
    private renderPartsSelectBox() {
        const partsEditTable = this.getPartsEditTable();
        if (!partsEditTable || this.state.attribute === undefined) {
            return;
        }
        
        const partsEditType = this.state.attribute[WWAConsts.ATR_TYPE];
        return (
            <select onChange={event => this.handleAttributeChange(event.target.value, WWAConsts.ATR_TYPE)} value={partsEditType}>
                {partsEditTable.map((partsEditItem, partsEditIndex) =>
                    <option key={partsEditIndex} value={partsEditItem.id}>{partsEditItem.name}</option>
                )}
            </select>
        );
    }

    /**
     * 編集フォームを出力します。
     */
    private renderEditForm() {
        if (
            this.props.state === undefined ||
            this.state.attribute === undefined ||
            this.state.message === undefined
        ) {
            return <p>WWAデータがありません。マップデータを開いてください。</p>;
        }

        const partsEditTable = this.getPartsEditTable();
        if (!partsEditTable) {
            return null;
        }
        
        const attribute = this.state.attribute;
        const message = this.state.message;
        const typeNumber = attribute[WWAConsts.ATR_TYPE];
        
        const PartsEditComponent = partsEditTable.find(item => item.id === typeNumber)?.component;
        if (PartsEditComponent === undefined) {
            throw new Error(`パーツ種別 ${typeNumber} 番に対応するパーツ種別が見つかりませんでした。`);
        }

        return (
            <PartsEditComponent
                attribute={attribute}
                message={message}
                onAttributeChange={this.handleAttributeChange}
                onMessageChange={this.handleMessageChange}
            />
        );

    }

    render() {
        return (
            <div>
                {this.renderPartsSelectBox()}
                {this.renderEditForm()}
                <div>
                    <button onClick={() => this.handleEditButtonClick()}>OK</button>
                    <button onClick={() => this.handleCancelButtonClick()}>取り消し</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartsEdit);
