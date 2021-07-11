import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode as setEditModeAction, EditMode, toggleGrid as toggleGridAction } from './map/MapStates';
import { Button, Label, Icon, List, SemanticICONS, Popup } from 'semantic-ui-react';
import { toggleInfoPanel as toggleInfoPanelAction } from './info/InfoPanelState';
import saveMapdata from './common/saveMapdata';
import { ipcRenderer } from 'electron';
import { openTestPlay } from './modal/ModalState';

const MainToolbar: React.FC = () => {

    const createNewMapdata = () => {
        ipcRenderer.send('new-wwadata');
    };

    const openMapdata = () => {
        ipcRenderer.send('open-wwadata');
    };

    const setEditMode = (editMode: EditMode) => {
        dispatch(setEditModeAction(editMode));
    };

    const toggleGrid = () => {
        dispatch(toggleGridAction());
    };

    const toggleInfoPanel = () => {
        dispatch(toggleInfoPanelAction());
    };

    const testPlay = () => {
        dispatch(openTestPlay());
    };

    /**
     * 編集モードを変更する各ボタンのコンポーネントです。
     */
    const EditModeButton: React.FC<{ editMode: EditMode, primaryIcon: SemanticICONS, secondaryIcon: SemanticICONS, title: string }> = ({ editMode, primaryIcon, secondaryIcon, title }) => {
        const onClick = () => {
            setEditMode(editMode);
        };
        return (
            <Popup
                content={title}
                trigger={
                    <Button active={editMode === currentEditMode} onClick={onClick}>
                        <div>
                            <Icon name={primaryIcon} />
                            <Icon name={secondaryIcon} />
                        </div>
                    </Button>
                }
            />
        );
    }

    const dispatch = useDispatch();

    const currentEditMode = useSelector(state => state.map.editMode);
    const currentPos = useSelector(state => state.map.currentPos);

    const isGridShown = useSelector(state => state.map.showGrid);
    const isInfoPanelOpened = useSelector(state => state.info.isOpened);

    return (
        <div>
            <List horizontal>
                <List.Item>
                    <Button onClick={createNewMapdata}>
                        <Icon name="file" />
                    </Button>
                </List.Item>
                <List.Item>
                    <Button onClick={openMapdata}>
                        <Icon name="folder open" />
                    </Button>
                </List.Item>
                <List.Item>
                    <Button onClick={() => saveMapdata()}>
                        <Icon name="save" />
                    </Button>
                </List.Item>
                <List.Item>
                    <Button.Group>
                        <EditModeButton editMode={EditMode.PUT_MAP} primaryIcon={'tree'} secondaryIcon={'arrow down'} title={"背景パーツ設置"} />
                        <EditModeButton editMode={EditMode.PUT_OBJECT} primaryIcon={'user'} secondaryIcon={'arrow down'} title={"物体パーツ設置"} />
                        <EditModeButton editMode={EditMode.EDIT_MAP} primaryIcon={'tree'} secondaryIcon={'pencil'} title={"背景パーツ編集"} />
                        <EditModeButton editMode={EditMode.EDIT_OBJECT} primaryIcon={'user'} secondaryIcon={'pencil'} title={"物体パーツ編集"} />
                        <EditModeButton editMode={EditMode.DELETE_OBJECT} primaryIcon={'user'} secondaryIcon={'remove'} title={"物体パーツ削除"} />
                    </Button.Group>
                </List.Item>
                {currentPos !== undefined &&
                    <List.Item>
                        <Label.Group>
                            <Label>
                                X
                                <Label.Detail>{currentPos.chipX}</Label.Detail>
                            </Label>
                            <Label>
                                Y
                                <Label.Detail>{currentPos.chipY}</Label.Detail>
                            </Label>
                        </Label.Group>
                    </List.Item>
                }
                <List.Item>
                    <Button onClick={toggleGrid} active={isGridShown}>
                        <Icon name="grid layout" />
                    </Button>
                    <Button onClick={toggleInfoPanel} active={isInfoPanelOpened}>
                        <Icon name="edit" />
                    </Button>
                </List.Item>
                <List.Item>
                    <Button onClick={testPlay}>
                        <Icon name="play" />
                    </Button>
                </List.Item>
            </List>
        </div>
    );
};

export default MainToolbar;
