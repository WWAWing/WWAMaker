import React from 'react';
import { LoadState } from '../../classes/Loader';

interface Props {
    state: LoadState;
    attribute: number[][];
    image: CanvasImageSource;
}

export default class MapLayer extends React.Component<Props, {}> {
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        attribute: [],
        image: new Image()
    }

    public render() {
        return (
            <div></div>
        )
    }
}
