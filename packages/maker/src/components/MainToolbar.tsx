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
type State = {
    mapdataFileName: string
}

class MainToolbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mapdataFileName: ''
        };
    }

    private handleClick() {
        this.props.openMapdata({ mapdataFileName: this.state.mapdataFileName });
    }

    /**
     * マップデーファイル名を変更します
     * @param event 
     * @todo 開く機能が実装でき次第削除する
     */
    private changeMapdataFileName(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            mapdataFileName: event.target.value
        })
    }

    public render() {
        return (
            <div>
                <input type='text' value={this.state.mapdataFileName} onChange={this.changeMapdataFileName.bind(this)} />
                <span onClick={this.handleClick.bind(this)}>open</span>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(MainToolbar);
