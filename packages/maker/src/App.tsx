import React from 'react';
import styles from './App.module.scss';
import MainToolbar from './components/MainToolbar';
import PartsSelect from './parts/PartsSelect';
import InfoPanel from './components/InfoPanel';
import MapView from './map/MapView';
import SplitPane from 'react-split-pane';
import './components/common/SplitPane.scss';

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
                <div className={styles.editArea}>
                    <SplitPane className={styles.editAreaSplitPane} split="horizontal" defaultSize={200} primary="second">
                        <MapView></MapView>
                        <PartsSelect></PartsSelect>
                    </SplitPane>
                </div>
                <div className={styles.InfoPanel}>
                    <InfoPanel></InfoPanel>
                </div>
            </div>
        );
    }
}
