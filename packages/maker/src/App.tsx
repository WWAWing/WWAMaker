import React from 'react';
import styles from './App.module.scss';
import MainToolbar from './MainToolbar';
import PartsSelect from './parts/PartsSelect';
import InfoPanel from './info/InfoPanel';
import MapEdit from './map/MapEdit';
import './common/SplitPane.scss';
import { useSelector } from 'react-redux';

/**
 * WWA Maker 全体のコンポーネントです。
 * この中に各パネルと MapView が含まれていて、これらの要素のレイアウトを行う役割を持ちます。
 */
const App: React.FC = () => {

    const isOpened = useSelector(state => state.info.isOpened);

    const getInfoPanelClassName = () => {
        const className = styles.infoPanel;

        if (isOpened) {
            return `${className} ${styles.isOpened}`;
        }

        return className;
    };

    return (
        <div className={styles.app}>
            <div className={styles.mainToolbar}>
                <MainToolbar></MainToolbar>
            </div>
            <div className={styles.map}>
                <MapEdit></MapEdit>
            </div>
            <PartsSelect className={styles.partsList} />
            <div className={getInfoPanelClassName()}>
                <InfoPanel></InfoPanel>
            </div>
        </div>
    );
}

export default App;
