import React from 'react';
import styles from './PartsSelect.module.scss';
import PartsList from '../components/common/PartsList';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from '../states';
import WWAConsts from '../classes/WWAConsts';
import ObjectPartsList from './ObjectPartsList';

interface Props {
    objectAttribute: number[][];
    mapAttribute: number[][];
    objPartsCount: number;
    mapPartsCount: number;
    image: CanvasImageSource;
}

/**
 * PartsSelect パーツ一覧のコンポーネントです。
 */
class PartsSelect extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        mapAttribute: [],
        objectAttribute: [],
        objPartsCount: 0,
        mapPartsCount: 0,
        image: new Image()
    }

    public render() {
        /**
         * @todo toolPanel は PartsSelect が元々 ToolPanel であったな残りであるため、できれば partsSelect に直す。
         */
        return (
            <div className={styles.toolPanel}>
                <ObjectPartsList
                    objectAttribute={this.props.objectAttribute}
                    objectPartsCount={this.props.objPartsCount}
                    selectPartsNumber={0}
                    image={this.props.image}
                ></ObjectPartsList>
                <div className={styles.toolPanelItem}>
                    <header className={styles.toolPanelItemHeader}>背景パーツ一覧</header>
                    <div className={styles.toolPanelItemContent}>
                        <PartsList
                            attribute={this.props.mapAttribute}
                            partsMax={this.props.mapPartsCount}
                            image={this.props.image}
                        ></PartsList>
                    </div>
                    <footer className={styles.toolPanelItemFooter}>
                        <div>選択パーツ: 0番</div>
                    </footer>
                </div>
            </div>
        );
    }
}

function getPartsCountPerIncreaseUnit(partsCount: number): number {
    if (partsCount < WWAConsts.PARTS_SIZE_DEFAULT) {
        return WWAConsts.PARTS_SIZE_DEFAULT;
    }
    return Math.ceil(partsCount / WWAConsts.PARTS_SIZE_INCREASE_UNIT) * WWAConsts.PARTS_SIZE_INCREASE_UNIT;
}

const mapStateToProps: MapStateToProps<Props, Props, AppState> = state => {
    const wwaData = state.mapData.wwaData;
    return {
        mapAttribute: wwaData.mapAttribute,
        objectAttribute: wwaData.objectAttribute,
        objPartsCount: getPartsCountPerIncreaseUnit(wwaData.objPartsMax),
        objSelectParts: state.mapData.parts.selectObject,
        mapPartsCount: getPartsCountPerIncreaseUnit(wwaData.mapPartsMax),
        mapSelectParts: state.mapData.parts.selectMap,
        image: state.mapData.image
    }
};

export default connect(mapStateToProps)(PartsSelect);
