import React from 'react';
import styles from './ToolPanel.module.scss';
import PartsList from './common/PartsList';

/**
 * @todo redux から接続出来るように実装する
 */
interface Props {
    objectAttribute: number[][];
    objectPartsCount: number;
    selectPartsNumber: number;
    image: CanvasImageSource;
}

/**
 * @todo 物体パーツ一覧と背景パーツ一覧を共通運用する SelectPartsList コンポーネントを作る
 */
export default class ObjectPartsList extends React.Component<Props, {}> {
    public render() {
        return (
            <div className={styles.toolPanelItem}>
                <header className={styles.toolPanelItemHeader}>物体パーツ一覧</header>
                <div className={styles.toolPanelItemContent}>
                    <PartsList
                        attribute={this.props.objectAttribute}
                        partsMax={this.props.objectPartsCount}
                        image={this.props.image}
                    ></PartsList>
                </div>
                <footer className={styles.toolPanelItemFooter}>
                    <div>選択パーツ: {this.props.selectPartsNumber}番</div>
                </footer>
            </div>
        );
    }
}
