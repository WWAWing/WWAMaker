import React from 'react';
import styles from './App.module.scss';
import MainToolbar from './MainToolbar';
import PartsSelect from './parts/PartsSelect';
import InfoPanel from './info/InfoPanel';
import MapEdit from './map/MapEdit';
import SplitPane from 'react-split-pane';
import './common/SplitPane.scss';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from './State';
import NotificationView from './notification/NotificationView';

interface StateProps {
    isOpened: boolean
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => ({
    isOpened: state.info.isOpened
});

/**
 * WWA Maker 全体のコンポーネントです。
 * この中に各パネルと MapView が含まれていて、これらの要素のレイアウトを行う役割を持ちます。
 */
class App extends React.Component<StateProps> {

    public static defaultProps: StateProps = {
        isOpened: false
    }

    private getInfoPanelClassName() {
        const className = styles.infoPanel;

        if (this.props.isOpened) {
            return `${className} ${styles.isOpened}`;
        }

        return className;
    }

    public render() {
        return (
            <>
                <NotificationView />
                <div className={styles.app}>
                    <div className={styles.mainToolbar}>
                        <MainToolbar></MainToolbar>
                    </div>
                    <div className={styles.editArea}>
                        <SplitPane split="horizontal" defaultSize={300} primary="second">
                            <MapEdit></MapEdit>
                            <PartsSelect></PartsSelect>
                        </SplitPane>
                    </div>
                    <div className={this.getInfoPanelClassName()}>
                        <InfoPanel></InfoPanel>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(App);
