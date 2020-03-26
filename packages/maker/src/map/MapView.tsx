import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import styles from './MapView.module.scss';
import MapLayer from '../components/common/MapLayer';
import WWAData from '../classes/WWAData';

interface Props {
    wwaData: WWAData|null;
    image: CanvasImageSource|null;
}

class MapView extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        wwaData: null,
        image: null
    }

    public render() {
        return (
            <div className={styles.mapView}>
                {(this.props.wwaData !== null && this.props.image !== null) &&
                    <>
                        <div className={styles.mapLayer}>
                            <MapLayer
                                hasTransparent={false}
                                map={this.props.wwaData.map}
                                attribute={this.props.wwaData.mapAttribute}
                                mapSize={this.props.wwaData.mapWidth}
                                image={this.props.image}
                            ></MapLayer>
                        </div>
                        <div className={styles.mapLayer}>
                            <MapLayer
                                hasTransparent={true}
                                map={this.props.wwaData.mapObject}
                                attribute={this.props.wwaData.objectAttribute}
                                mapSize={this.props.wwaData.mapWidth}
                                image={this.props.image}
                            ></MapLayer>
                        </div>
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<Props, Props, StoreType> = state => {
    return {
        wwaData: state.wwaData,
        image: state.image
    };
}

export default connect(mapStateToProps)(MapView);
