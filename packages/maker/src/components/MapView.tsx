import React from 'react';
import styles from './MapView.module.scss';

export default class MapView extends React.Component {
    public render() {
        return (
            <div className={styles.mapView}>
                <div className={styles.dummyMap}></div>
            </div>
        );
    }
}
