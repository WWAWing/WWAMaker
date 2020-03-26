import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadMapdata } from '../load/LoadStates';
import { thunkToAction } from 'typescript-fsa-redux-thunk';

const mapDispatchToProps = (dispatch: Dispatch) => {
    // TODO: bindActionCreators の動きについて調べる
    return bindActionCreators(
        {
            openMapdata: thunkToAction(loadMapdata.action)
        },
        dispatch
    )
}

type Props = ReturnType<typeof mapDispatchToProps>;

class MainToolbar extends React.Component<Props> {
    private handleClick() {
        this.props.openMapdata({ mapdataFileName: 'wwamap.dat' });
    }

    public render() {
        return (
            <div>
                <span onClick={this.handleClick.bind(this)}>open</span>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(MainToolbar);
