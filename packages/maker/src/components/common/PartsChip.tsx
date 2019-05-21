import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    cropX: number,
    cropY: number,
    image: ImageData
}

export default class PartsChip extends React.Component<Props, {}> {
    private imgRef: RefObject<HTMLImageElement>;

    constructor(props: Props) {
        super(props);
        this.imgRef = React.createRef();
    }

    public componentDidMount() {
        if (this.imgRef !== null) {
            /**
             * @todo this.props.image から読み出して、 img 要素の src に割り当てるようにしたい。
             */
        }
    }

    public render() {
        return (
            <img ref={this.imgRef} width={WWAConsts.CHIP_SIZE} height={WWAConsts.CHIP_SIZE}></img>
        )
    }
}
