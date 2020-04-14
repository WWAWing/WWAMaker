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
import { Form, Portal, Button, Icon } from "semantic-ui-react";
import PartsChip from "../common/PartsChip";
import { GraphicSelect } from "../common/GraphicSelect";

interface StateProps {
    /**
     * 開いているパーツの種類と番号です。
     */
    state?: InfoPanelPartsEditState,
    /**
     * WWAデータ本体です。上記の state の値から必要な情報をこの wwaData の中から探します。
     */
    wwaData?: WWAData,
    image?: CanvasImageSource
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        state: state.info.partsEdit,
        wwaData: state.wwaData || undefined,
        image: state.image || undefined
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
 *     graphicSelect はパーツのグラフィックの選択状態を示すステートです。
 */
interface State {
    parts?: PartsEditState;
    graphicSelect: GraphicSelectState;
}

interface PartsEditState {
    attribute: number[];
    message: string;
}

type GraphicSelectState = "NONE" | "1" | "2";

/**
 * パーツ編集の管理を行う Container コンポーネントです。
 *     編集フォームは、パーツ種別毎に用意した専用のコンポーネントを取り出して表示されます。
 */
class PartsEdit extends React.Component<Props, State> {

    /**
     * パーツCGの選択画面を表示する場所を決める要素の Ref です。
     *     Semantic UI React の Portal では、切り替えで表示される要素は原則HTMLのルートに配置されます。
     *     ルートで配置された場合、 WWA Maker としては都合が良くないため、編集画面の決まった位置で表示されるように Ref を設けて、その Ref に対してマウントするようにしています。
     */
    private graphicSelectMountRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            parts: this.receive(),
            graphicSelect: "NONE"
        };
        this.graphicSelectMountRef = React.createRef();

        /**
         * 予め子コンポーネントに渡すメソッドに対して this を bind します。
         */
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.props.state !== prevProps.state) {
            this.setState({
                parts: this.receive()
            });
        }
    }

    /**
     * Redux のステートからパーツ情報を出力します。
     */
    private receive(): PartsEditState | undefined {
        if (this.props.state === undefined || this.props.wwaData === undefined) {
            return undefined;
        }

        if (this.props.state.type === PartsType.MAP) {
            const attribute = this.props.wwaData.mapAttribute[this.props.state.number].slice();
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return {
                attribute: attribute,
                message: message
            };
        } else if (this.props.state.type === PartsType.OBJECT) {
            const attribute = this.props.wwaData.objectAttribute[this.props.state.number].slice();
            const message = this.props.wwaData.message[attribute[WWAConsts.ATR_STRING]] || '';
            return {
                attribute: attribute,
                message: message
            };
        }

        return undefined;
    }

    /**
     * 入力画面のステートを Redux のステートにも反映させます。
     */
    private send() {
        if (this.props.state === undefined || this.state.parts === undefined) {
            return;
        }
        
        this.props.editParts({
            type: this.props.state.type,
            number: this.props.state.number,
            attributes: this.state.parts.attribute,
            message: this.state.parts.message
        });
    }

    /**
     * パーツCGの選択画面を開きます。
     * @param type 開きたいパーツCG選択の種類
     */
    private showGraphicSelect(type: GraphicSelectState) {
        this.setState({
            graphicSelect: type
        });
    }

    /**
     * パーツCGの選択画面を閉じます。
     */
    private closeGraphicSelect() {
        this.setState({
            graphicSelect: "NONE"
        });
    }

    /**
     * パーツのグラフィック画像を変更し、ステートに反映します。
     */
    private setPartsGraphic(chipX: number, chipY: number, type: GraphicSelectState) {
        if (this.state.parts === undefined || type === "NONE") {
            return;
        }

        let newAttribute = this.state.parts.attribute.slice();
        switch (type) {
            case "1":
                newAttribute[WWAConsts.ATR_X] = chipX * WWAConsts.CHIP_SIZE;
                newAttribute[WWAConsts.ATR_Y] = chipY * WWAConsts.CHIP_SIZE;
                break;
            case "2":
                newAttribute[WWAConsts.ATR_X2] = chipX * WWAConsts.CHIP_SIZE;
                newAttribute[WWAConsts.ATR_Y2] = chipY * WWAConsts.CHIP_SIZE;
                break;
        }

        this.setState({
            parts: {
                attribute: newAttribute,
                message: this.state.parts.message
            }
        });

        this.closeGraphicSelect();
    }

    /**
     * @see PartsEditAttributeChange
     */
    private handleAttributeChange(value: string, attributeIndex: number) {
        if (this.state.parts === undefined) {
            return;
        }

        let newAttribute = this.state.parts.attribute.slice();
        const parsedValue = parseInt(value);
        newAttribute[attributeIndex] = Number.isNaN(parsedValue) ? 0 : parsedValue;

        this.setState({
            parts: {
                attribute: newAttribute,
                message: this.state.parts.message
            }
        });
    }

    /**
     * @see PartsEditMessageChange
     */
    private handleMessageChange(value: string) {
        if (this.state.parts === undefined) {
            return;
        }
        
        this.setState({
            parts: {
                attribute: this.state.parts.attribute,
                message: value
            }
        });
    }

    private handleEditButtonClick() {
        this.send();
        this.props.switchInfoPanel({ mode: "GENERAL" });
    }

    private handleCancelButtonClick() {
        this.props.switchInfoPanel({ mode: "GENERAL" });
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
        if (!partsEditTable || this.state.parts === undefined) {
            return;
        }
        
        const partsEditType = this.state.parts.attribute[WWAConsts.ATR_TYPE];
        return (
            <select onChange={event => this.handleAttributeChange(event.target.value, WWAConsts.ATR_TYPE)} value={partsEditType}>
                {partsEditTable.map((partsEditItem, partsEditIndex) =>
                    <option key={partsEditIndex} value={partsEditItem.id}>{partsEditItem.name}</option>
                )}
            </select>
        );
    }

    /**
     * パーツCGの選択部分を出力します。
     */
    private renderPartsGraphic(type: GraphicSelectState, attributeIndexX: number, attributeIndexY: number) {
        if (this.state.parts === undefined || this.props.image === undefined) {
            return;
        }

        const attribute = this.state.parts.attribute;
        return (
            <Portal
                trigger={
                    <PartsChip
                        cropX={attribute[attributeIndexX]}
                        cropY={attribute[attributeIndexY]}
                        image={this.props.image}
                        isSelected={false}
                        onClick={() => {}}
                    />
                }
                open={this.state.graphicSelect === type}
                onOpen={() => this.showGraphicSelect(type)}
                onClose={() => this.closeGraphicSelect()}
                mountNode={this.graphicSelectMountRef?.current}
            >
                <GraphicSelect
                    image={this.props.image}
                    onChange={(chipX, chipY) => this.setPartsGraphic(chipX, chipY, type)}
                />
            </Portal>
        );
    }

    private renderPartsGraphics() {
        if (this.props.state === undefined) {
            return null;
        }

        return (
            <>
                {this.renderPartsGraphic("1", WWAConsts.ATR_X, WWAConsts.ATR_Y)}

                {this.props.state.type === PartsType.OBJECT &&
                    this.renderPartsGraphic("2", WWAConsts.ATR_X2, WWAConsts.ATR_Y2)
                }

                <div ref={this.graphicSelectMountRef}></div>
            </>
        );
    }

    /**
     * 編集フォームを出力します。
     */
    private renderEditForm() {
        if (
            this.props.state === undefined ||
            this.state.parts === undefined
        ) {
            return <p>WWAデータがありません。マップデータを開いてください。</p>;
        }

        const partsEditTable = this.getPartsEditTable();
        if (!partsEditTable) {
            return null;
        }
        
        const attribute = this.state.parts.attribute;
        const message = this.state.parts.message;
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
            <Form>
                {this.renderPartsSelectBox()}
                {this.renderPartsGraphics()}
                {this.renderEditForm()}
                <Form.Field>
                    <Button primary onClick={() => this.handleEditButtonClick()}>
                        <Icon name="check" />
                        OK
                    </Button>
                    <Button onClick={() => this.handleCancelButtonClick()}>
                        <Icon name="cancel" />
                        取り消し
                    </Button>
                </Form.Field>
            </Form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartsEdit);
