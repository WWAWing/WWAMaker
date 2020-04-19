import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadMapdata } from './load/LoadStates';
import { thunkToAction } from 'typescript-fsa-redux-thunk';
import { setEditMode, EditMode } from './map/MapStates';
import { StoreType } from './State';
import saveMapdata from './common/saveMapdata';

const mapStateToProps = (state: StoreType) => {
    return {
        currentPos: state.map.currentPos
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    // TODO: bindActionCreators の動きについて調べる
    return bindActionCreators(
        {
            openMapdata: thunkToAction(loadMapdata.action),
            setEditMode: setEditMode
        },
        dispatch
    )
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

type State = {
    mapdataFileName: string,
    editMode: EditMode
}

class MainToolbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mapdataFileName: 'wwamap.dat',
            editMode: EditMode.PUT_MAP
        };
    }

    private clickOpenButton() {
        this.props.openMapdata({ mapdataFileName: this.state.mapdataFileName });
    }

    /**
     * 編集モードを変更します
     * @param editMode 変更したい編集モード
     */
    private selectEditMode(editMode: EditMode) {
        this.props.setEditMode({ editMode: editMode });
        this.setState({
            editMode: editMode
        });
    }

    /**
     * マップデーファイル名を変更します
     * @param event 
     * @todo 開く機能が実装でき次第削除する
     */
    private changeMapdataFileName(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            mapdataFileName: event.target.value
        })
    }

    public render() {
        return (
            <div>
                <div>
                    <input type='text' value={this.state.mapdataFileName} onChange={this.changeMapdataFileName.bind(this)} />
                    <span onClick={this.clickOpenButton.bind(this)}>open</span>
                    <span onClick={() => saveMapdata()}>save</span>
                    {this.editModeButton(EditMode.PUT_MAP, "背景パーツ設置")}
                    {this.editModeButton(EditMode.PUT_OBJECT, "物体パーツ設置")}
                    {this.editModeButton(EditMode.EDIT_MAP, "背景パーツ編集")}
                    {this.editModeButton(EditMode.EDIT_OBJECT, "物体パーツ編集")}
                    {this.editModeButton(EditMode.DELETE_OBJECT, "物体パーツ削除")}
                </div>
                <div>
                    <span>X: {this.props.currentPos.chipX}</span>
                    <span>Y: {this.props.currentPos.chipY}</span>
                </div>
            </div>
        );
    }

    private editModeButton(editMode: EditMode, labelName: string) {
        return <label>
                <input type='radio' checked={this.state.editMode === editMode} onChange={() => this.selectEditMode(editMode)}></input>
                {labelName}
            </label>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainToolbar);
