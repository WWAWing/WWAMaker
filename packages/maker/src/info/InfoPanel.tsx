import React from 'react';
import { InfoPanelMode, switchInfoPanel } from './InfoPanelState';
import { MapStateToProps, connect } from 'react-redux';
import { StoreType } from '../State';
import MapFoundation from './MapFoundation';
import SystemMessage from './SystemMessage';
import PartsEdit from './PartsEdit';
import { Dispatch, bindActionCreators } from 'redux';
import { Sidebar, Header, Segment, Tab, Button, Icon } from 'semantic-ui-react';

interface UserProps {
    className: string
}

interface StateProps {
    isOpened: boolean,
    viewMode: InfoPanelMode
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = (state) => {
    return {
        isOpened: state.info.isOpened,
        viewMode: state.info.viewMode
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(({
        switchInfoPanel: switchInfoPanel
    }), dispatch);
}

type Props = UserProps & StateProps & ReturnType<typeof mapDispatchToProps>;

/**
 * InfoPanel は画面右に配置されるパネルのことで、主にパーツの編集やマップデータの情報などではこの InfoPanel から表示されます。
 * 使い勝手としては、 Apple の Pages や WordPress の Gutenberg に近づけています。
 */
class InfoPanel extends React.Component<Props> {

    public static defaultProps: UserProps & StateProps = {
        className: "",
        isOpened: false,
        viewMode: "GENERAL"
    }

    public renderInside() {
        if (!this.props.isOpened) {
            return null;
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
                <Tab menu={{ attached: "top" }} panes={panes} />
            </Segment>
        );
    }

    public render() {
        return (
            <Sidebar
                animation="overlay"
                direction="right"
                width="very wide"
                visible={this.props.isOpened}
                className={this.props.className}
            >
                {this.renderInside()}
            </Sidebar>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel);
