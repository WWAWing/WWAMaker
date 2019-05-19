import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loadWWAData } from '../states/MapData';

interface Props {
    dispatch: Dispatch;
}

class MainToolbar extends React.Component<Props> {
    public render() {
        return (
            <div>
                <button onClick={() => {
                    this.props.dispatch(loadWWAData('wwamap.dat'));
                }}>open</button>
            </div>
        );
    }
}

export default connect()(MainToolbar);
