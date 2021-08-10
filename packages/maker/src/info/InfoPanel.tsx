import React from 'react';
import { switchInfoPanel } from './InfoPanelState';
import { useSelector, useDispatch } from 'react-redux';
import MapFoundation from './MapFoundation';
import SystemMessage from './SystemMessage';
import PartsEdit from './PartsEdit';
import { Header, Segment, Tab, Button, Icon } from 'semantic-ui-react';

/**
 * InfoPanel は画面右に配置されるパネルのことで、主にパーツの編集やマップデータの情報などではこの InfoPanel から表示されます。
 * 使い勝手としては、 Apple の Pages や WordPress の Gutenberg に近づけています。
 */
const InfoPanel: React.FC = () => {

    const viewMode = useSelector(state => state.info.viewMode);
    const hasMapdata = useSelector(state => state.wwaData !== null);

    const dispatch = useDispatch();

    if (!hasMapdata) {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name="file" />
                    ツールバーやメニューバーから WWA のマップデータを開いてください。
                </Header>
                { /* TODO: 開くボタンを設ける */}
            </Segment>
        );
    }

    switch (viewMode) {
        case "PARTS_EDIT":
            return (
                <>
                    <Header attached="top">
                        <Button onClick={() => dispatch(switchInfoPanel("GENERAL"))}>
                            <Icon name="close"/>
                        </Button>
                        パーツの編集
                    </Header>
                    <Segment attached>
                        <PartsEdit></PartsEdit>
                    </Segment>
                </>
            );
    }

    const panes = [
        {
            menuItem: {
                key: "MAP_FOUNDATION",
                content: "基本設定の編集"
            },
            render: () => <MapFoundation></MapFoundation>,
        }, {
            menuItem: {
                key: "SYSTEM_MESSAGE",
                content: "システムメッセージの編集"
            },
            render: () => <SystemMessage></SystemMessage>,
        }
    ];

    return (
        <Segment attached>
            <Tab menu={{ attached: "top", vertical: true }} grid={{ paneWidth: 16, tabWidth: 16 }} panes={panes} />
        </Segment>
    );

}

export default InfoPanel;
