import React from 'react';
import styles from './MainEditArea.module.scss';
import ToolPanel from './ToolPanel';
import InfoPanel from './InfoPanel';
import MapView from './MapView';

/**
 * MainEditArea は編集領域全体を指しています。
 * この中に各パネルと MapView が含まれていて、 MainEditArea はこれらの要素のレイアウトを行う役割を持ちます。
 */
export default class MainEditArea extends React.Component {
    public render() {
        return (
            <div className={styles.mainEditArea}>
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
