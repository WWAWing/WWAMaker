import React from 'react';
import styles from './App.module.scss';
import MainToolbar from './components/MainToolbar';
import ToolPanel from './components/ToolPanel';
import InfoPanel from './components/InfoPanel';
import MapView from './components/MapView';
import WWAData from './classes/WWAData';

interface Props {}

/**
 * WWA Maker 全体のコンポーネントです。
 * この中に各パネルと MapView が含まれていて、これらの要素のレイアウトを行う役割を持ちます。
 */
export default class App extends React.Component {
    private wwaData: WWAData;

    constructor (props: Props) {
        super(props);
        this.wwaData = new WWAData('./wwamap.dat');
    }

    public render() {

        return (
            <div className={styles.app}>
                <div className={styles.mainToolbar}>
                    <MainToolbar></MainToolbar>
                </div>
                <div className={styles.mapView}>
                    <MapView></MapView>
                </div>
                <div className={styles.infoPanel}>
                    <InfoPanel></InfoPanel>
                </div>
                <div className={styles.toolPanel}>
                    <ToolPanel></ToolPanel>
                </div>
            </div>
        );
    }
}
