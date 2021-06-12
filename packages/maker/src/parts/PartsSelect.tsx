import React from 'react';
import styles from './PartsSelect.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectObjectParts, selectMapParts } from './PartsState';
import PartsList from '../common/PartsList';
import { PartsType } from '../classes/WWAData';
import { showPartsEdit } from '../info/InfoPanelState';
import { Button, Segment, Label, Header } from 'semantic-ui-react';
import { deleteParts } from '../wwadata/WWADataState';
import { useImage } from 'wwamaker-image-decorder';

/**
 * パーツ一覧の Container コンポーネントです。
 */
const PartsSelect: React.FC<{
    className: string
}> = ({ className }) => {

    const objectAttribute = useSelector(state => state.wwaData?.objectAttribute);
    const mapAttribute = useSelector(state => state.wwaData?.mapAttribute);
    const objParts = useSelector(state => state.objParts);
    const mapParts = useSelector(state => state.mapParts);
    const imageUrl = useSelector(state => state.imageUrl);
    const image = useImage(imageUrl ?? "");

    const dispatch = useDispatch();

    /**
     * @see PartsList
     */
    const handlePartsSelect = (partsNumber: number, partsType: PartsType) => {
        switch (partsType) {
            case PartsType.OBJECT:
                dispatch(selectObjectParts(partsNumber));
                break;
            case PartsType.MAP:
                dispatch(selectMapParts(partsNumber));
                break;
        }
    };

    /**
     * パーツ編集イベントが発生した際に実行するメソッドです。
     * @param partsNumber 編集したいパーツ番号 (子コンポーネントの PartsChip 側で呼び出す際に必要)
     * @param partsType 対象のパーツ種類
     */
    const handlePartsEdit = (partsNumber: number, partsType: PartsType) => {
        switch (partsType) {
            case PartsType.OBJECT:
                dispatch(showPartsEdit({ type: partsType, number: partsNumber }));
                break;
            case PartsType.MAP:
                dispatch(showPartsEdit({ type: partsType, number: partsNumber }));
        }
    };

    const handlePartsDelete = (partsType: PartsType) => {
        const partsNumber = (() => {
            switch (partsType) {
                case PartsType.OBJECT:
                    return objParts.number;
                case PartsType.MAP:
                    return mapParts.number;
            }
        })();

        dispatch(deleteParts({
            type: partsType,
            number: partsNumber
        }));
    };

    const renderPartsList = (partsType: PartsType) => {
        let partsAttribute, partsNumber: number, title;
        switch (partsType) {
            case PartsType.OBJECT:
                partsAttribute = objectAttribute;
                partsNumber = objParts.number;
                title = "物体パーツ一覧";
                break;
            case PartsType.MAP:
                partsAttribute = mapAttribute;
                partsNumber = mapParts.number;
                title = "背景パーツ一覧";
                break;
            default:
                return null;
        }

        if (partsAttribute === undefined || image === null) {
            return null;
        }

        return (
            <div className={styles.toolPanelItem}>
                <Header size="small" attached="top" className={styles.toolPanelItemHeader}>{title}</Header>

                <PartsList
                    type={partsType}
                    attribute={partsAttribute}
                    selectPartsNumber={partsNumber}
                    onPartsSelect={handlePartsSelect}
                    onPartsEdit={handlePartsEdit}
                    image={image}
                />

                <Segment compact attached="bottom" className={styles.toolPanelItemFooter}>
                    <Label>
                        選択パーツ
                        <Label.Detail>{partsNumber}</Label.Detail>
                    </Label>
                    <Button.Group floated="right">
                        <Button onClick={() => handlePartsEdit(partsNumber, partsType)}>選択パーツ編集</Button>
                        <Button onClick={() => handlePartsDelete(partsType)}>選択パーツ削除</Button>
                    </Button.Group>
                </Segment>
            </div>
        );
    };

    /**
     * @todo toolPanel は PartsSelect が元々 ToolPanel であったな残りであるため、できれば partsSelect に直す。
     */
    return (
        <div className={`${styles.toolPanel} ${className}`}>
            {renderPartsList(PartsType.OBJECT)}
            {renderPartsList(PartsType.MAP)}
        </div>
    );
};

export default PartsSelect;
