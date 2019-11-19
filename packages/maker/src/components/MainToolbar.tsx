import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loadWWAData } from '../states/MapData';

interface Props {
    dispatch: Dispatch;
}

interface States {
    mapdataFileName: string;
}

class MainToolbar extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mapdataFileName: ''
        }
    }

    private handleClick() {
        this.props.dispatch(loadWWAData(this.state.mapdataFileName));
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

export default connect()(MainToolbar);
