import React from 'react';
import { InfoPanelMode, switchInfoPanel } from './InfoPanelState';
import { MapStateToProps, connect } from 'react-redux';
import { StoreType } from '../State';
import MapFoundation from './MapFoundation';
import SystemMessage from './SystemMessage';
import PartsEdit from './PartsEdit';
import { Dispatch, bindActionCreators } from 'redux';

interface StateProps {
    viewMode: InfoPanelMode
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = (state) => {
    return {
        viewMode: state.info.viewMode
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
        viewMode: "MAP_FOUNDATION"
    }

    private getInfoPanelView() {
        switch (this.props.viewMode) {
            case "MAP_FOUNDATION":
                return <MapFoundation></MapFoundation>;
            case "SYSTEM_MESSAGE":
                return <SystemMessage></SystemMessage>;
            case "PARTS_EDIT":
                return <PartsEdit></PartsEdit>;
        }
    }

    public render() {
        return (
            <div>
                <header>
                    <div>インフォパネル</div>
                </header>
                <div>
                    <button onClick={ () => this.props.switchInfoPanel({ mode: "MAP_FOUNDATION" }) }>基本設定の編集</button>
                    <button onClick={ () => this.props.switchInfoPanel({ mode: "SYSTEM_MESSAGE" }) }>システムメッセージの編集</button>
                </div>
                <div>
                    {this.getInfoPanelView()}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel);
