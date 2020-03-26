import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import styles from './MapView.module.scss';
import MapCanvas from '../components/common/MapCanvas';
import WWAData from '../classes/WWAData';
import { Dispatch, bindActionCreators } from 'redux';
import { setCurrentPos } from './MapStates';
import WWAConsts from '../classes/WWAConsts';

interface StateProps {
    wwaData: WWAData|null;
    image: CanvasImageSource|null;
    currentPos: {
        x: number,
        y: number
    }
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        wwaData: state.wwaData,
        image: state.image,
        currentPos: state.map.currentPos
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        setCurrentPos: setCurrentPos
    }, dispatch);
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

class MapView extends React.Component<Props, {}> {
    public static defaultProps: StateProps = {
        wwaData: null,
        image: null,
        currentPos: {
            x: 0,
            y: 0
        }
    }

    /**
     * マウスの位置から現在位置を設定します。
     * @param x 
     * @param y 
     */
    private setCurrentPos(x: number, y: number) {
        const chipX = Math.floor(x / WWAConsts.CHIP_SIZE);
        const chipY = Math.floor(y / WWAConsts.CHIP_SIZE);
        if (chipX === this.props.currentPos.x && chipY === this.props.currentPos.y) {
            return;
        }

        this.props.setCurrentPos({
            chipX: chipX,
            chipY: chipY
        });
    }

    public render() {
        return (
            <div className={styles.mapView}>
                {(this.props.wwaData !== null && this.props.image !== null) &&
                    <>
                        <div className={styles.mapCanvas}>
                            <MapCanvas
                                map={[this.props.wwaData.map, this.props.wwaData.mapObject]}
                                attribute={[this.props.wwaData.mapAttribute, this.props.wwaData.objectAttribute]}
                                mapSize={this.props.wwaData.mapWidth}
                                image={this.props.image}
                                currentPos={this.props.currentPos}
                                onMouseMove={this.setCurrentPos.bind(this)}
                            ></MapCanvas>
                        </div>
                    </>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
