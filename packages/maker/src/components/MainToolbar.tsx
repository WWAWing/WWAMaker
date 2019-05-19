import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loadWWAData } from '../states/MapData';

interface Props {
    dispatch: Dispatch;
}

class MainToolbar extends React.Component<Props> {
    private handleClick() {
        this.props.dispatch(loadWWAData('wwamap.dat'));
    }

    public render() {
        return (
            <div>
                <span onClick={this.handleClick.bind(this)}>open</span>
            </div>
        );
    }
}

export default connect()(MainToolbar);
