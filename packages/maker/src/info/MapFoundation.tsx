import React from "react";
import { RowForm, Grid, Cell, SubmitForm} from "./InfoPanelCommon" ;
import { MapStateToProps, connect } from "react-redux";
import { StoreType } from "../State";
import { WWAData } from "@wwawing/common-interface";
import WWAConsts from "../classes/WWAConsts";
import { getPartsCountPerIncreaseUnit } from "../common/PartsList";
import { bindActionCreators, Dispatch } from "redux";
import { setMapFoundation } from "../wwadata/WWADataState";

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

/**
 * 基本設定の編集
 */
class MapFoundation extends React.Component<Props, MapFoundationField> {

    public static defaultProps: StateProps = {
        wwaData: null
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            worldName: '',
            mapCGName: '',
            playerX: 0,
            playerY: 0,
            gameoverX: 0,
            gameoverY: 0,
            statusEnergyMax: 0,
            statusEnergy: 0,
            statusStrength: 0,
            statusDefence: 0,
            statusGold: 0,
            mapWidth: WWAConsts.MAP_SIZE_DEFAULT,
            objectPartsMax: WWAConsts.PARTS_SIZE_DEFAULT,
            mapPartsMax: WWAConsts.PARTS_SIZE_DEFAULT
        }
    }

    public componentDidUpdate(prevProps: StateProps) {
        /**
         * @todo この比較方法は精度が低いかもしれない
         */
        if (this.props !== prevProps) {
            this.receive();
        }
    }

    /**
     * テキストボックスです。名前を元にステートを参照します。
     */
    private textInput(name: keyof MapFoundationField, label: string) {
        return (
            <RowForm label={label}>
                <input
                    type="text"
                    name={name}
                    value={this.state[name]}
                    onChange={this.handleChange.bind(this)}
                >
                </input>
            </RowForm>
        )
    }

    /**
     * Redux ステートの更新を本コンポーネントのステートに受け取ります。
     */
    private receive() {
        if (this.props.wwaData === null) {
            return;
        }

        /**
         * @todo このままでは冗長すぎるので、各キーの名前を書かなくてもいいように実装したい
         */
        this.setState({
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
        });
    }

    /**
     * コンポーネントのステートを Redux ステートに送ります。
     */
    private send() {
        this.props.setMapFoundation(this.state);
    }

    /**
     * コンポーネントのステートをリセットし、 Redux ステートの値に変更します。
     */
    private reset() {
        this.receive();
    }

    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target.name as keyof MapFoundationField;
        if (!(name in this.state)) {
            return;
        }

        const value = typeof this.state[name] === "number" ? parseInt(event.target.value)
            : event.target.value;
        // HACK: オブジェクトで実装すると型が合わないため、メソッド形式で実行している
        this.setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    public render() {
        if (this.props.wwaData === null) {
            return (
                <div>
                    <p>マップデータを開いてください。</p>
                </div>
            )
        }

        return (
            <div>
                {this.textInput("worldName", "ワールド名")}
                {this.textInput("mapCGName", "GIF画像ファイル名")}
                <Grid>
                    <Cell>
                        {this.textInput("playerX", "プレイヤー初期X座標")}
                        {this.textInput("playerY", "プレイヤー初期Y座標")}
                        {this.textInput("gameoverX", "ゲームオーバーX座標")}
                        {this.textInput("gameoverY", "ゲームオーバーY座標")}
                    </Cell>
                    <Cell>
                        {this.textInput("statusEnergyMax", "生命力上限")}
                        {this.textInput("statusEnergy", "初期生命力")}
                        {this.textInput("statusStrength", "初期攻撃力")}
                        {this.textInput("statusDefence", "初期防御力")}
                        {this.textInput("statusGold", "初期所持金")}
                    </Cell>
                </Grid>
                {this.textInput("mapWidth", "現在のマップサイズ")}
                {this.textInput("objectPartsMax", "物体パーツ最大数")}
                {this.textInput("mapPartsMax", "背景パーツ最大数")}
                <SubmitForm
                    onSubmitButtonClick={() => { this.send() }}
                    onResetButtonClick={() => { this.reset() }}
                ></SubmitForm>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapFoundation);
