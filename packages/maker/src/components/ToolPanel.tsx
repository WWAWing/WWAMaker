import React from 'react';
import styles from './ToolPanel.module.scss';
import PartsList from './common/PartsList';
import { connect, MapStateToProps } from 'react-redux';
import { LoadState } from '../classes/Loader';
import { AppState } from '../states';

interface Props {
    state: LoadState;
    mapAttribute: number[][];
    objectAttribute: number[][];
    image: CanvasImageSource;
}

/**
 * ToolPanel は画面下に配置されるパネルのことで、主にパーツ一覧ではこの ToolPanel から表示されます。
 * PartsListPanel としないのは、今後のバージョンアップで表示内容が変更されても、コンポーネント名を維持するためです。
 */
class ToolPanel extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        mapAttribute: [],
        objectAttribute: [],
        image: new Image()
    }

    public render() {
        return (
            <div className={styles.toolPanel}>
                <PartsList
                    attribute={this.props.objectAttribute}
                    image={this.props.image}
                ></PartsList>
                <PartsList
                    attribute={this.props.mapAttribute}
                    image={this.props.image}
                ></PartsList>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<Props, Props, AppState> = state => {
    const wwaData = state.mapData.wwaData;
    return {
        state: state.mapData.loadState,
        mapAttribute: wwaData.mapAttribute,
        objectAttribute: wwaData.objectAttribute,
        image: state.mapData.image
    }
};

export default connect(mapStateToProps)(ToolPanel);
