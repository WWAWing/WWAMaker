import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getPartsCountPerIncreaseUnit from "../common/getPartsCountPerIncreaseUnit";
import { Form, Button, Input, Icon } from "semantic-ui-react";
import WWAConsts from "../classes/WWAConsts";
import { startImageLoading } from "../load/LoadStates";
import { setMapFoundation } from "../wwadata/WWADataState";
import { ipcRenderer } from "electron";

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
 * 初期状態の MapFoundationField です。
 * @todo できる限り common-interface に入れる
 */
const defaultMapFoundationField: MapFoundationField = {
    worldName: "",
    mapCGName: "",
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

};

/**
 * 基本設定の編集
 */
const MapFoundation: React.FC<{}> = () => {

    const filePath = useSelector(state => state.load?.currentFilePath);
    const imageFilename = useSelector(state => state.wwaData?.mapCGName);

    /**
     * Redux ステートの更新を本コンポーネントのステートに受け取ります。
     */
    const receiveField: () => MapFoundationField = () => {
        if (stateField === undefined) {
            return defaultMapFoundationField;
        }

        return stateField;
    };

    const sendField = () => {
        if (stateField === undefined) {
            return;
        }
    
        // FIXME: 2度実行すると画像が更新されない
        if (field.mapCGName !== imageFilename) {
            dispatch(startImageLoading());
            ipcRenderer.send('load-image', { filePath, imageFilename: field.mapCGName });
        }
    
        dispatch(setMapFoundation(field));
    };

    /**
     * コンポーネントのステートをリセットし、 Redux ステートの値に変更します。
     */
    const resetField = () => {
        updateField(receiveField());
    };

    /**
     * field の内容を変更したい場合に使用するコールバックメソッドです。
     */
    const setStateField = (name: keyof MapFoundationField, value: string|number) => {
        // HACK: オブジェクトで実装すると型が合わないため、メソッド形式で実行している
        updateField({
            ...field,
            [name]: value
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (field === undefined) {
            return;
        }

        const name = event.target.name as keyof MapFoundationField;
        if (!(name in field)) {
            return;
        }

        setStateField(name, event.target.value);
    };

    /**
     * フィールドの値を増やします。
     * @param name 増やしたいフィールドの名前
     * @param increaseValue 増やす値
     * @param valueMax 最大値
     */
    const expandValue = (name: keyof MapFoundationField, increaseValue: number, valueMax: number) => {
        if (field === undefined) {
            return;
        }

        const value = field[name];
        if (typeof value !== "number") {
            throw new Error(`${name} は数字ではありません。`);
        }

        const newValue = Math.min(value + increaseValue, valueMax);
        setStateField(name, newValue);
    }

    const stateField: MapFoundationField = useSelector(state => {
        if (state.wwaData === null) {
            return defaultMapFoundationField;
        }
    
        // TODO: このままでは冗長すぎるので、各キーの名前を書かなくてもいいように実装したい
        return {
            worldName: state.wwaData.worldName,
            mapCGName: state.wwaData.mapCGName,
            playerX: state.wwaData.playerX,
            playerY: state.wwaData.playerY,
            gameoverX: state.wwaData.gameoverX,
            gameoverY: state.wwaData.gameoverY,
            statusEnergyMax: state.wwaData.statusEnergyMax,
            statusEnergy: state.wwaData.statusEnergy,
            statusStrength: state.wwaData.statusStrength,
            statusDefence: state.wwaData.statusDefence,
            statusGold: state.wwaData.statusGold,
            mapWidth: state.wwaData.mapWidth,
            objectPartsMax: getPartsCountPerIncreaseUnit(state.wwaData.objectAttribute.length),
            mapPartsMax: getPartsCountPerIncreaseUnit(state.wwaData.mapAttribute.length)
        };
    });
    const [field, updateField] = useState<MapFoundationField>(receiveField());

    const dispatch = useDispatch();

    if (field === undefined) {
        return (
            <div>
                <p>マップデータを開いてください。</p>
            </div>
        )
    }

    return (
        <Form>
            <TextInput
                name="worldName"
                label="ワールド名"
                value={field.worldName}
                onChange={handleChange}
            />
            <TextInput
                name="mapCGName"
                label="GIF画像ファイル名"
                value={field.mapCGName}
                onChange={handleChange}
            />

                <TextInput
                    name="playerX"
                    label="プレイヤー初期X座標"
                    value={field.playerX}
                    onChange={handleChange}
                />
                <TextInput
                    name="playerY"
                    label="プレイヤー初期Y座標"
                    value={field.playerY}
                    onChange={handleChange}
                />
                <TextInput
                    name="gameoverX"
                    label="ゲームオーバーX座標"
                    value={field.gameoverX}
                    onChange={handleChange}
                />
                <TextInput
                    name="gameoverY"
                    label="ゲームオーバーY座標"
                    value={field.gameoverY}
                    onChange={handleChange}
                />

                <TextInput
                    name="statusEnergyMax"
                    label="生命力上限"
                    value={field.statusEnergyMax}
                    onChange={handleChange}
                />
                <TextInput
                    name="statusEnergy"
                    label="初期生命力"
                    value={field.statusEnergy}
                    onChange={handleChange}
                />
                <TextInput
                    name="statusStrength"
                    label="初期攻撃力"
                    value={field.statusStrength}
                    onChange={handleChange}
                />
                <TextInput
                    name="statusDefence"
                    label="初期防御力"
                    value={field.statusDefence}
                    onChange={handleChange}
                />
                <TextInput
                    name="statusGold"
                    label="初期所持金"
                    value={field.statusGold}
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
                    value={`${field.mapWidth} × ${field.mapWidth}`}
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
                    value={field.objectPartsMax}
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
                    value={field.mapPartsMax}
                />
            </Form.Field>
            <Form.Field>
                <Button primary onClick={sendField}>
                    <Icon name="check" />
                    決定
                </Button>
                <Button onClick={resetField}>
                    <Icon name="cancel" />
                    リセット
                </Button>
            </Form.Field>
        </Form>
    );
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

export default MapFoundation;
