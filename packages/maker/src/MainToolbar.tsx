import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadMapdata } from './load/LoadStates';
import { thunkToAction } from 'typescript-fsa-redux-thunk';
import { setEditMode, EditMode } from './map/MapStates';
import { StoreType } from './State';
import { Input, Button, Label, Icon, List } from 'semantic-ui-react';
import { toggleInfoPanel } from './info/InfoPanelState';
import saveMapdata from './common/saveMapdata';

const mapStateToProps = (state: StoreType) => {
    return {
        currentPos: state.map.currentPos,
        isInfoPanelOpened: state.info.isOpened
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    // TODO: bindActionCreators の動きについて調べる
    return bindActionCreators(
        {
            openMapdata: thunkToAction(loadMapdata.action),
            setEditMode: setEditMode,
            toggleInfoPanel: toggleInfoPanel
        },
        dispatch
    );
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
                <List horizontal>
                    <List.Item>
                        <Input
                            action={{
                                icon: "folder open",
                                onClick: this.clickOpenButton.bind(this)
                            }}
                            type="text"
                            value={this.state.mapdataFileName}
                            onChange={this.changeMapdataFileName.bind(this)}
                        />
                    </List.Item>
                    <List.Item>
                        <Button onClick={() => saveMapdata()}>
                            <Icon name="save" />
                        </Button>
                    </List.Item>
                    <List.Item>
                        <Button.Group basic>
                            {this.editModeButton(EditMode.PUT_MAP, "背景パーツ設置")}
                            {this.editModeButton(EditMode.PUT_OBJECT, "物体パーツ設置")}
                            {this.editModeButton(EditMode.EDIT_MAP, "背景パーツ編集")}
                            {this.editModeButton(EditMode.EDIT_OBJECT, "物体パーツ編集")}
                            {this.editModeButton(EditMode.DELETE_OBJECT, "物体パーツ削除")}
                        </Button.Group>
                    </List.Item>
                    <List.Item>
                        <Label.Group>
                            <Label>
                                X
                                <Label.Detail>{this.props.currentPos.chipX}</Label.Detail>
                            </Label>
                            <Label>
                                Y
                                <Label.Detail>{this.props.currentPos.chipY}</Label.Detail>
                            </Label>
                        </Label.Group>
                    </List.Item>
                    <List.Item>
                        <Button onClick={() => this.props.toggleInfoPanel()} active={this.props.isInfoPanelOpened}>
                            <Icon name="edit" />
                        </Button>
                    </List.Item>
                </List>
            </div>
        );
    }

    private editModeButton(editMode: EditMode, labelName: string) {
        return (
            <Button active={this.state.editMode === editMode} onClick={() => this.selectEditMode(editMode)}>
                {labelName}
            </Button>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainToolbar);
