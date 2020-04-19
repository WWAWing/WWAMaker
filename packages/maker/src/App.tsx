import React from 'react';
import styles from './App.module.scss';
import MainToolbar from './MainToolbar';
import PartsSelect from './parts/PartsSelect';
import InfoPanel from './info/InfoPanel';
import MapView from './map/MapView';
import SplitPane from 'react-split-pane';
import './common/SplitPane.scss';
import { Sidebar } from 'semantic-ui-react';

/**
 * WWA Maker 全体のコンポーネントです。
 * この中に各パネルと MapView が含まれていて、これらの要素のレイアウトを行う役割を持ちます。
 */
export default class App extends React.Component {
    public render() {
        return (
            <div className={styles.app}>
                <div className={styles.mainToolbar}>
                    <MainToolbar></MainToolbar>
                </div>
                <Sidebar.Pushable as="div" className={styles.editArea}>
                    <InfoPanel className={styles.infoPanel}></InfoPanel>
                    <Sidebar.Pusher>
                        <SplitPane split="horizontal" defaultSize={300} primary="second">
                            <MapView></MapView>
                            <PartsSelect></PartsSelect>
                        </SplitPane>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}
