import React from 'react';
import styles from './PartsSelect.module.scss';
import { connect, MapStateToProps } from 'react-redux';
import ObjectPartsList from './ObjectPartsList';
import MapPartsList from './MapPartsList';
import { StoreType } from '../State';
import WWAData from '../classes/WWAData';
import { PartsState, INITIAL_STATE } from './PartsState';

interface Props {
    wwaData: WWAData|null;
    image: CanvasImageSource|null;
    objParts: PartsState;
    mapParts: PartsState;
}

/**
 * PartsSelect パーツ一覧のコンポーネントです。
 */
class PartsSelect extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        wwaData: null,
        image: null,
        objParts: INITIAL_STATE,
        mapParts: INITIAL_STATE
    }

    public render() {
        /**
         * @todo toolPanel は PartsSelect が元々 ToolPanel であったな残りであるため、できれば partsSelect に直す。
         */
        return (
            <div className={styles.toolPanel}>
                {(this.props.wwaData !== null && this.props.image !== null) &&
                    <>
                        <ObjectPartsList
                            objectAttribute={this.props.wwaData.objectAttribute}
                            selectPartsNumber={this.props.objParts.number}
                            image={this.props.image}
                        ></ObjectPartsList>
                        <MapPartsList
                            mapAttribute={this.props.wwaData.mapAttribute}
                            selectPartsNumber={this.props.mapParts.number}
                            image={this.props.image}
                        ></MapPartsList>
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<Props, Props, StoreType> = state => {
    return {
        wwaData: state.wwaData,
        image: state.image,
        objParts: state.objParts,
        mapParts: state.mapParts
    }
};

export default connect(mapStateToProps)(PartsSelect);
