import React from 'react';
import { InfoPanelMode } from './InfoPanelState';
import { MapStateToProps, connect } from 'react-redux';
import { StoreType } from '../State';
import { MapFoundation } from './MapFoundation';

interface StateProps {
    viewMode: InfoPanelMode   
}

const mapDispatchToProps: MapStateToProps<StateProps, StateProps, StoreType> = (state) => {
    return {
        viewMode: state.info.viewMode
    };
}

type Props = StateProps;

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
                return MapFoundation();
        }
        return (<></>);
    }

    public render() {
        return (
            <div>
                <header>
                    <div>インフォパネル</div>
                </header>
                <div>
                    {this.getInfoPanelView()}
                </div>
            </div>
        );
    }
}

export default connect(mapDispatchToProps)(InfoPanel);
