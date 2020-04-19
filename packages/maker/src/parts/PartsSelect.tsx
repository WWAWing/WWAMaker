import React from 'react';
import styles from './PartsSelect.module.scss';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import { WWAData } from "@wwawing/common-interface";
import { PartsState, INITIAL_STATE, selectObjParts, selectMapParts } from './PartsState';
import PartsList from '../common/PartsList';
import { Dispatch, bindActionCreators } from 'redux';
import { PartsType } from '../classes/WWAData';
import { showPartsEdit } from '../info/InfoPanelState';
import { Button, Segment, Label, Header } from 'semantic-ui-react';

interface StateProps {
    wwaData: WWAData|null;
    image: CanvasImageSource|null;
    objParts: PartsState;
    mapParts: PartsState;
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        selectObjParts: selectObjParts,
        selectMapParts: selectMapParts,
        showPartsEdit: showPartsEdit
    }, dispatch);
};

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

/**
 * パーツ一覧の Container コンポーネントです。
 */
class PartsSelect extends React.Component<Props, {}> {
    public static defaultProps: StateProps = {
        wwaData: null,
        image: null,
        objParts: INITIAL_STATE,
        mapParts: INITIAL_STATE
    }

    /**
     * @see PartsList
     */
    private handlePartsSelect(partsNumber: number, partsType: PartsType) {
        switch (partsType) {
            case PartsType.OBJECT:
                this.props.selectObjParts({ number: partsNumber });
                break;
            case PartsType.MAP:
                this.props.selectMapParts({ number: partsNumber });
                break;
        }
    }

    private handlePartsEdit(partsType: PartsType) {
        switch (partsType) {
            case PartsType.OBJECT:
                if (this.props.objParts.number === 0) {
                    alert("パーツ番号０の物体は編集できません。\nこのパーツはマップの物体を消去するときに指定してください。");
                    return;
                }
                this.props.showPartsEdit({ type: partsType, number: this.props.objParts.number });
                break;
                case PartsType.MAP:
                if (this.props.mapParts.number === 0) {
                    alert("パーツ番号０の背景は編集できません。\nこのパーツはマップの背景を消去するときに指定してください。");
                    return;
                }
                this.props.showPartsEdit({ type: partsType, number: this.props.mapParts.number });
                break;
        }
    }

    private handlePartsDelete(partsType: PartsType) {

    }

    private renderPartsList(partsType: PartsType) {
        let partsAttribute, partsNumber, title;
        switch (partsType) {
            case PartsType.OBJECT:
                partsAttribute = this.props.wwaData?.objectAttribute;
                partsNumber = this.props.objParts.number;
                title = "物体パーツ一覧";
                break;
            case PartsType.MAP:
                partsAttribute = this.props.wwaData?.mapAttribute;
                partsNumber = this.props.mapParts.number;
                title = "背景パーツ一覧";
                break;
            default:
                return null;
        }

        if (partsAttribute === undefined || this.props.image === null) {
            return null;
        }

        return (
            <div className={styles.toolPanelItem}>
                <Header size="small" attached="top" className={styles.toolPanelItemHeader}>{title}</Header>

                <PartsList
                    type={partsType}
                    attribute={partsAttribute}
                    selectPartsNumber={partsNumber}
                    onPartsSelect={this.handlePartsSelect.bind(this)}
                    image={this.props.image}
                />

                <Segment compact attached="bottom" className={styles.toolPanelItemFooter}>
                    <Label>
                        選択パーツ
                        <Label.Detail>{partsNumber}</Label.Detail>
                    </Label>
                    <Button.Group floated="right">
                        <Button onClick={() => this.handlePartsEdit(partsType)}>選択パーツ編集</Button>
                        <Button onClick={() => this.handlePartsDelete(partsType)}>選択パーツ削除</Button>
                    </Button.Group>
                </Segment>
            </div>
        );
    }

    public render() {
        /**
         * @todo toolPanel は PartsSelect が元々 ToolPanel であったな残りであるため、できれば partsSelect に直す。
         */
        return (
            <div className={styles.toolPanel}>
                {this.renderPartsList(PartsType.OBJECT)}
                {this.renderPartsList(PartsType.MAP)}
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        wwaData: state.wwaData,
        image: state.image,
        objParts: state.objParts,
        mapParts: state.mapParts
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartsSelect);
