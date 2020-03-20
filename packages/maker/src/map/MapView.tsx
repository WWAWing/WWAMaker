import React from 'react';
import WWAConsts from '../classes/WWAConsts';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from '../states';
import { LoadState } from '../load/Loader';
import styles from './MapView.module.scss';
import MapLayer from '../components/common/MapLayer';

interface Props {
    state: LoadState;
    map: number[][];
    mapObject: number[][];
    mapAttribute: number[][];
    objectAttribute: number[][];
    mapSize: number;
    image: CanvasImageSource;
}

class MapView extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        map: [],
        mapObject: [],
        mapAttribute: [],
        objectAttribute: [],
        mapSize: WWAConsts.MAP_SIZE_DEFAULT,
        image: new Image()
    }

    public render() {
        return (
            <div className={styles.mapView}>
                <div className={styles.mapLayer}>
                    <MapLayer
                        state={this.props.state}
                        hasTransparent={false}
                        map={this.props.map}
                        attribute={this.props.mapAttribute}
                        mapSize={this.props.mapSize}
                        image={this.props.image}
                    ></MapLayer>
                </div>
                <div className={styles.mapLayer}>
                    <MapLayer
                        state={this.props.state}
                        hasTransparent={true}
                        map={this.props.mapObject}
                        attribute={this.props.objectAttribute}
                        mapSize={this.props.mapSize}
                        image={this.props.image}
                    ></MapLayer>
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<Props, Props, AppState> = state => {
    const wwaData = state.mapData.wwaData;
    return {
        state: state.mapData.loadState,
        map: wwaData.map,
        mapObject: wwaData.mapObject,
        mapAttribute: wwaData.mapAttribute,
        objectAttribute: wwaData.objectAttribute,
        mapSize: wwaData.mapWidth,
        image: state.mapData.image
    };
}

export default connect(mapStateToProps)(MapView);
