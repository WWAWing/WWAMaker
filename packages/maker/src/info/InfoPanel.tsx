import React from 'react';
import { InfoPanelMode, switchInfoPanel } from './InfoPanelState';
import { MapStateToProps, connect } from 'react-redux';
import { StoreType } from '../State';
import MapFoundation from './MapFoundation';
import SystemMessage from './SystemMessage';
import PartsEdit from './PartsEdit';
import { Dispatch, bindActionCreators } from 'redux';
import { Header, Segment, Tab, Button, Icon } from 'semantic-ui-react';

interface StateProps {
    viewMode: InfoPanelMode,
    hasMapdata: boolean
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = (state) => {
    return {
        viewMode: state.info.viewMode,
        hasMapdata: state.wwaData !== null
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(({
        switchInfoPanel: switchInfoPanel
    }), dispatch);
}

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

/**
 * InfoPanel は画面右に配置されるパネルのことで、主にパーツの編集やマップデータの情報などではこの InfoPanel から表示されます。
 * 使い勝手としては、 Apple の Pages や WordPress の Gutenberg に近づけています。
 */
class InfoPanel extends React.Component<Props> {

    public static defaultProps: StateProps = {
        viewMode: "GENERAL",
        hasMapdata: false
    }

    public render() {

        if (!this.props.hasMapdata) {
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

        switch (this.props.viewMode) {
            case "PARTS_EDIT":
                return (
                    <>
                        <Header attached="top">
                            <Button onClick={() => this.props.switchInfoPanel({ mode: "GENERAL" })}>
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

}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel);
