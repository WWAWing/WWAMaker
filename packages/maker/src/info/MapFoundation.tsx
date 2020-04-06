import React from "react";
import { MapStateToProps, connect } from "react-redux";
import { StoreType } from "../State";
import { WWAData } from "@wwawing/common-interface";
import getPartsCountPerIncreaseUnit from "../common/getPartsCountPerIncreaseUnit";
import { bindActionCreators, Dispatch } from "redux";
import { setMapFoundation } from "../wwadata/WWADataState";
import { Form, Button, Input } from "semantic-ui-react";
import WWAConsts from "../classes/WWAConsts";

interface StateProps {
    wwaData: WWAData | null
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => ({
    wwaData: state.wwaData
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        setMapFoundation: setMapFoundation
    }, dispatch);
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

/**
 * 基本設定の編集で使用する欄です。
 */
export interface MapFoundationField {
    worldName: string,
    mapCGName: string,
    playerX: number,
    playerY: number,
    gameoverX: number,
    gameoverY: number,
    statusEnergyMax: number,
    statusEnergy: number,
    statusStrength: number,
    statusDefence: number,
    statusGold: number,
    mapWidth: number,
    objectPartsMax: number,
    mapPartsMax: number
}

export type State = {
    field?: MapFoundationField
};

/**
 * 基本設定の編集
 */
class MapFoundation extends React.Component<Props, State> {

    public static defaultProps: StateProps = {
        wwaData: null
    }

    constructor(props: Props) {
        super(props);
        this.state = this.receive();
    }

    public componentDidUpdate(prevProps: StateProps) {
        /**
         * @todo この比較方法は精度が低いかもしれない
         */
        if (this.props !== prevProps) {
            this.setState(this.receive());
        }
    }

    /**
     * Redux ステートの更新を本コンポーネントのステートに受け取ります。
     */
    private receive(): State {
        if (this.props.wwaData === null) {
            return {};
        }

        /**
         * @todo このままでは冗長すぎるので、各キーの名前を書かなくてもいいように実装したい
         */
        return({
            field: {
                worldName: this.props.wwaData.worldName,
                mapCGName: this.props.wwaData.mapCGName,
                playerX: this.props.wwaData.playerX,
                playerY: this.props.wwaData.playerY,
                gameoverX: this.props.wwaData.gameoverX,
                gameoverY: this.props.wwaData.gameoverY,
                statusEnergyMax: this.props.wwaData.statusEnergyMax,
                statusEnergy: this.props.wwaData.statusEnergy,
                statusStrength: this.props.wwaData.statusStrength,
                statusDefence: this.props.wwaData.statusDefence,
                statusGold: this.props.wwaData.statusGold,
                mapWidth: this.props.wwaData.mapWidth,
                objectPartsMax: getPartsCountPerIncreaseUnit(this.props.wwaData.objectAttribute.length),
                mapPartsMax: getPartsCountPerIncreaseUnit(this.props.wwaData.mapAttribute.length)
            }
        });
    }

    /**
     * コンポーネントのステートを Redux ステートに送ります。
     */
    private send() {
        if (this.state.field === undefined) {
            return;
        }

        this.props.setMapFoundation(this.state.field);
    }

    /**
     * コンポーネントのステートをリセットし、 Redux ステートの値に変更します。
     */
    private reset() {
        this.receive();
    }

    /**
     * this.state.field の内容を変更したい場合に使用するコールバックメソッドです。
     */
    private setStateField(name: keyof MapFoundationField, value: string|number) {
        // HACK: オブジェクトで実装すると型が合わないため、メソッド形式で実行している
        this.setState(prevState => {
            if (prevState.field === undefined) {
                return {};
            }
            return {
                field: {
                    ...prevState.field,
                    [name]: value
                }
            }
        });
    }

    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (this.state.field === undefined) {
            return;
        }

        const name = event.target.name as keyof MapFoundationField;
        if (!(name in this.state.field)) {
            return;
        }

        this.setStateField(name, event.target.value);
    }

    /**
     * フィールドの値を増やします。
     * @param name 増やしたいフィールドの名前
     * @param increaseValue 増やす値
     * @param valueMax 最大値
     */
    private expandValue(name: keyof MapFoundationField, increaseValue: number, valueMax: number) {
        if (this.state.field === undefined) {
            return;
        }

        const value = this.state.field[name];
        if (typeof value !== "number") {
            throw new Error(`${name} は数字ではありません。`);
        }

        const newValue = Math.min(value + increaseValue, valueMax);
        this.setStateField(name, newValue);
    }

    public render() {
        if (this.state.field === undefined) {
            return (
                <div>
                    <p>マップデータを開いてください。</p>
                </div>
            )
        }

        const handleChange = this.handleChange.bind(this);
        const expandValue = this.expandValue.bind(this);

        return (
            <Form>
                <TextInput
                    name="worldName"
                    label="ワールド名"
                    value={this.state.field.worldName}
                    onChange={handleChange}
                />
                <TextInput
                    name="mapCGName"
                    label="GIF画像ファイル名"
                    value={this.state.field.mapCGName}
                    onChange={handleChange}
                />

                    <TextInput
                        name="playerX"
                        label="プレイヤー初期X座標"
                        value={this.state.field.playerX}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="playerY"
                        label="プレイヤー初期Y座標"
                        value={this.state.field.playerY}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="gameoverX"
                        label="ゲームオーバーX座標"
                        value={this.state.field.gameoverX}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="gameoverY"
                        label="ゲームオーバーY座標"
                        value={this.state.field.gameoverY}
                        onChange={handleChange}
                    />

                    <TextInput
                        name="statusEnergyMax"
                        label="生命力上限"
                        value={this.state.field.statusEnergyMax}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="statusEnergy"
                        label="初期生命力"
                        value={this.state.field.statusEnergy}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="statusStrength"
                        label="初期攻撃力"
                        value={this.state.field.statusStrength}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="statusDefence"
                        label="初期防御力"
                        value={this.state.field.statusDefence}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="statusGold"
                        label="初期所持金"
                        value={this.state.field.statusGold}
                        onChange={handleChange}
                    />

                <Form.Field>
                    <label>現在のマップサイズ</label>
                    <Input
                        action={{
                            content: "拡張",
                            onClick: () => expandValue("mapWidth", WWAConsts.MAP_SIZE_INCREASE_UNIT, WWAConsts.MAP_SIZE_MAX)
                        }}
                        name="mapWidth"
                        value={`${this.state.field.mapWidth} × ${this.state.field.mapWidth}`}
                    />
                </Form.Field>
                <Form.Field>
                    <label>物体パーツ最大数</label>
                    <Input
                        action={{
                            content: "拡張",
                            onClick: () => expandValue("objectPartsMax", WWAConsts.PARTS_SIZE_INCREASE_UNIT, WWAConsts.PARTS_SIZE_MAX)
                        }}
                        name="objectPartsMax"
                        value={this.state.field.objectPartsMax}
                    />
                </Form.Field>
                <Form.Field>
                    <label>背景パーツ最大数</label>
                    <Input
                        action={{
                            content: "拡張",
                            onClick: () => expandValue("mapPartsMax", WWAConsts.PARTS_SIZE_INCREASE_UNIT, WWAConsts.PARTS_SIZE_MAX)
                        }}
                        name="mapPartsMax"
                        value={this.state.field.mapPartsMax}
                    />
                </Form.Field>
                <div>
                    <Button onClick={() => { this.send() }}>決定</Button>
                    <Button onClick={() => { this.reset() }}>リセット</Button>
                </div>
            </Form>
        );
    }
}

const TextInput: React.FunctionComponent<{
    name: keyof MapFoundationField,
    label: string,
    value: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = props => {
    return (
        <Form.Field>
            <label>{props.label}</label>
            <input
                type="text"
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            >
            </input>
        </Form.Field>
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(MapFoundation);
