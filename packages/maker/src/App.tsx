import React, { RefObject } from 'react';
import styles from './App.module.scss';
import MainToolbar from './components/MainToolbar';
import ToolPanel from './components/ToolPanel';
import InfoPanel from './components/InfoPanel';
import MapView from './components/MapView';
import WWAData from './classes/WWAData';

interface State {
    wwaData: WWAData|null
    image: HTMLImageElement
}

/**
 * WWA Maker 全体のコンポーネントです。
 * この中に各パネルと MapView が含まれていて、これらの要素のレイアウトを行う役割を持ちます。
 */
export default class App extends React.Component<{}, State> {
    private mapViewRef: RefObject<MapView>;

    constructor (props: {}) {
        super(props);
        this.state = {
            wwaData: null,
            image: new Image()
        }
        this.mapViewRef = React.createRef();
        this._load('./wwamap.dat');
    }

    private _load(fileName: string) {
        const loaderWorker = new Worker('./wwaload.js');

        loaderWorker.postMessage({
            fileName: fileName
        });
        loaderWorker.addEventListener('message', event => {
            if (event.data.error !== null) {
                throw new Error(event.data.error.message);
            }
            if (event.data.progress === null && event.data.wwaData !== undefined) {
                this._setMapData(event.data.wwaData);
            }
        });
    }

    private _setMapData(wwaData: WWAData) {
        let image = this.state.image;
        image.src = wwaData.mapCGName;
        image.addEventListener('load', () => {
            if (this.mapViewRef.current !== null) {
                this.mapViewRef.current.drawMap();
            }
        });

        this.setState({
            wwaData: wwaData,
            image: image
        });
        
    }

    public render() {
        return (
            <div className={styles.app}>
                <div className={styles.mainToolbar}>
                    <MainToolbar></MainToolbar>
                </div>
                <div className={styles.mapView}>
                    {this.renderMap()}
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

    private renderMap() {
        if (this.state.wwaData === null || this.state.wwaData === undefined) {
            return (<MapView ref={this.mapViewRef}></MapView>);
        }

        return (
            <MapView
                ref={this.mapViewRef}
                map={this.state.wwaData.map}
                mapObject={this.state.wwaData.mapObject}
                mapAttribute={this.state.wwaData.mapAttribute}
                objectAttribute={this.state.wwaData.objectAttribute}
                mapSize={this.state.wwaData.mapWidth}
                image={this.state.image}
            ></MapView>
        );
    }
}
