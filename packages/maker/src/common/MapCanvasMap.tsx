import React from "react";
import { StoreType } from "../State";
import { Coord } from "@wwawing/common-interface";
import WWAConsts from "../classes/WWAConsts";
import { connect } from "react-redux";
import { PartsType } from "../classes/WWAData";
import styles from './MapCanvas.module.scss';

/**
 * MapChunk のサイズです。一番左のチャンクは横幅1マス、一番上のチャンクは縦幅1マス増えます。
 */
const CHUNK_SIZE = 20;

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';

const mapStateToProps = (state: StoreType) => {
    const getCrops = (attribute: number[]): Coord => {
        return {
            x: attribute[WWAConsts.ATR_X],
            y: attribute[WWAConsts.ATR_Y]
        };
    };

    const mapCrops = state.wwaData?.mapAttribute.map(getCrops);
    const objectCrops = state.wwaData?.objectAttribute.map(getCrops);
    return {
        fieldMap: [
            {
                type: PartsType.MAP,
                map: state.wwaData?.map,
                crops: mapCrops
            }, {
                type: PartsType.OBJECT,
                map: state.wwaData?.mapObject,
                crops: objectCrops
            }
        ],
        mapWidth: state.wwaData?.mapWidth,
        image: state.image
    };
};

type Props = ReturnType<typeof mapStateToProps>;

class MapCanvasMap extends React.Component<Props> {
    public static whyDidYouRender = true;
    public shouldComponentUpdate(prevProps: Props) {
        return this.props.fieldMap.some((mapLayer, layerNumber) => {
            const prevMapLayer = prevProps.fieldMap[layerNumber];
            const prevMap = prevMapLayer.map;
            const prevCrops = prevMapLayer.crops;
            // TODO: この場合だとマップが何も描画されていない状態は描画されっぱなしになるので描画されないように調整する
            if (prevMap === undefined || prevCrops === undefined) {
                return true;
            }

            const fieldMapChanged = mapLayer.map?.some((line, y) => {
                return line.some((partsNumber, x) => {
                    return partsNumber !== prevMap[y][x];
                });
            }) ?? false;

            const partsCropChanged = mapLayer.crops?.some((crop, partsNumber) => {
                return crop.x !== prevCrops[partsNumber].x
                    || crop.y !== prevCrops[partsNumber].y;
            }) ?? false;

            return fieldMapChanged || partsCropChanged;
        });
    }

    public render() {
        const image = this.props.image;
        if (image === null) {
            return null;
        }
        const mapWidth = this.props.mapWidth ?? 0;

        let chunks: Coord[][][][][] = []; // チャンクY, チャンクX, レイヤー, マスY, マスX
        this.props.fieldMap.forEach((layer, layerIndex) => {
            const layerCrops = layer.crops;
            if (layer.map === undefined || layerCrops === undefined) {
                return;
            }

            let screenY = 0;
            for (let y = 1; y < mapWidth; y += CHUNK_SIZE) {

                chunks[screenY] = layerIndex === 0 ? [] : chunks[screenY];
                const startSliceY = y === 1 ? 0 : y;
                const endSliceY = y + CHUNK_SIZE;

                let screenX = 0;
                for (let x = 1; x < mapWidth; x += CHUNK_SIZE) {

                    chunks[screenY][screenX] = layerIndex === 0 ? [] : chunks[screenY][screenX];
                    const startSliceX = x === 1 ? 0 : x;
                    const endSliceX = x + CHUNK_SIZE;

                    const targetMap = layer.map.slice(startSliceY, endSliceY).map(chunkLine => {
                        return chunkLine.slice(startSliceX, endSliceX).map(partsNumber => {
                            return layerCrops[partsNumber];
                        });
                    });

                    chunks[screenY][screenX].push(targetMap);
                    screenX++;
                }

                screenY++;
            }
        });

        return (
            <>
                {chunks.map((chunkLine, chunkLineIndex) => (
                    <div className={styles.mapCanvasLine} key={chunkLineIndex}>
                        {chunkLine.map((chunk, chunkColumnIndex) => (
                            <MapChunk
                                key={chunkColumnIndex}
                                map={chunk}
                                image={image}
                            />
                        ))}
                    </div>
                ))}
            </>
        );
    }
}

export default connect(mapStateToProps)(MapCanvasMap);


/**
 * 1画面程度の画面を描画する Canvas 要素です。
 *     プロパティ map はイメージ画像で参照される場所の座標を記載した配列になっています。
 */
class MapChunk extends React.Component<{
    map: Coord[][][],
    image: CanvasImageSource
}> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapChunk["props"]) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    /**
     * 各マスの変更を確認し、変更が見つかった場合にだけ componentDidUpdate を実行させます。
     */
    shouldComponentUpdate(prevProps: MapChunk["props"]) {
        return prevProps.map.some((line, lineIndex) =>
            line.some((layer, layerIndex) =>
                layer.some((imageCoord, index) =>
                    imageCoord.x !== this.props.map[lineIndex][layerIndex][index].x ||
                    imageCoord.y !== this.props.map[lineIndex][layerIndex][index].y
                )
            )
        );
    }

    private draw() {
        if (this.canvasRef.current === null) {
            return;
        }
        const context = this.canvasRef.current.getContext('2d');
        if (context === null) {
            return;
        }

        const elementSize = this.getElementSize();
        context.fillStyle = MAP_CANVAS_BASE_COLOR;
        context.fillRect(0, 0, elementSize.x, elementSize.y);

        this.props.map.forEach((layer, index) => {
            layer.forEach((line, y) => {
                line.forEach((imageCropCoord, x) => {
                    if (imageCropCoord.x === 0 && imageCropCoord.y === 0) {
                        return;
                    }
                    context.drawImage(
                        this.props.image,
                        imageCropCoord.x,
                        imageCropCoord.y,
                        WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE,
                        x * WWAConsts.CHIP_SIZE,
                        y * WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE
                    );
                });
            });
        });
    }

    private getElementSize(): Coord {
        return {
            x: this.props.map[0][0].length * WWAConsts.CHIP_SIZE,
            y: this.props.map[0].length * WWAConsts.CHIP_SIZE
        };
    }

    public render() {
        const elementSize = this.getElementSize();
        return (
            <canvas
                ref={this.canvasRef}
                width={elementSize.x}
                height={elementSize.y}
            />
        );
    }
};
