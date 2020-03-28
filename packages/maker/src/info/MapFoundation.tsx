import React from "react";
import { RowForm, Grid, Cell, SubmitForm } from "./InfoPanelCommon";

/**
 * 基本設定の編集
 */
export function MapFoundation() {
    return (
        <div>
            <RowForm label="ワールド名">
                <input type="text"></input>
            </RowForm>
            <RowForm label="GIF画像ファイル名">
                <input type="text"></input>
            </RowForm>
            <Grid>
                <Cell>
                    <RowForm label="プレイヤー初期X座標">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="プレイヤー初期Y座標">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="ゲームオーバーX座標">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="ゲームオーバーY座標">
                        <input type="text"></input>
                    </RowForm>
                </Cell>
                <Cell>
                    <RowForm label="生命力上限">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="初期生命力">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="初期攻撃力">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="初期防御力">
                        <input type="text"></input>
                    </RowForm>
                    <RowForm label="初期所持金">
                        <input type="text"></input>
                    </RowForm>
                </Cell>
            </Grid>
            <RowForm label="現在のマップサイズ">
                <input type="text"></input>
            </RowForm>
            <RowForm label="物体パーツ最大数">
                <input type="text"></input>
            </RowForm>
            <RowForm label="背景パーツ最大数">
                <input type="text"></input>
            </RowForm>
            <SubmitForm
                onSubmitButtonClick={() => {}}
                onResetButtonClick={() => {}}
            ></SubmitForm>
        </div>
    )
}
