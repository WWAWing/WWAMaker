import React, { useEffect, useRef } from 'react';
import WWAConsts from '../classes/WWAConsts';
import drawRedRect from './drawRedRect';

interface Props {
    cropX: number,
    cropY: number,
    image: CanvasImageSource,
    isSelected: boolean,
    onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void,
    onDoubleClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void,
    onContextMenu?: (event: React.MouseEvent<HTMLCanvasElement>) => void
}

const PartsChip: React.FC<Props> = props => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (props.onContextMenu === undefined) {
            return;
        }
        event.preventDefault();
        props.onContextMenu(event);
    };

    useEffect(() => {
        const canvasContext = canvasRef.current?.getContext("2d");
        if (!canvasContext) {
            return;
        }

        canvasContext.clearRect(0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        canvasContext.drawImage(props.image, props.cropX, props.cropY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        if (props.isSelected) {
            drawRedRect(canvasContext, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        }
    }, [props.cropX, props.cropY, props.image, props.isSelected]);


    // 原作の作成ツールではマウスボタンを押したタイミングで反応するため、その形に従うようにしている
    return (
        <canvas
            ref={canvasRef}
            width={WWAConsts.CHIP_SIZE}
            height={WWAConsts.CHIP_SIZE}
            onMouseDown={props.onClick}
            onDoubleClick={props.onDoubleClick}
            onContextMenu={handleContextMenu}
        />
    );
};

export default PartsChip;
