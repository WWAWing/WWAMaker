import React from "react";
import { MapStateToProps, connect } from "react-redux";
import { StoreType } from "../State";
import { Dispatch, bindActionCreators } from "redux";
import { SystemMessage1, SystemMessage2, SystemMessageType } from "../classes/WWAData";
import { setSystemMessage } from "../wwadata/WWADataState";
import { Form, Message, Button } from "semantic-ui-react";

interface StateProps {
    systemMessage: string[] | null
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => ({
    systemMessage: state.wwaData !== null ? state.wwaData.systemMessage : null
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        setSystemMessage: setSystemMessage
    }, dispatch);
}

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

export type SystemMessageField = {
    messages: string[]
};

/**
 * 対応しているシステムメッセージの一覧です。
 *     id: WWAData.systemMessages の参照に使用するID
 *     label: 編集画面で表示されるテキスト (1変数1行として表示)
 */
const AvailabeSystemMessages: { id: SystemMessageType, label: string[] }[] = [
    {
        id: SystemMessage1.ASK_LINK,
        label: ["リンクするときに表示する確認メッセージ"]
    },
    {
        id: SystemMessage1.NO_MONEY,
        label: ["物を買うときに所持金が足りない場合のメッセージ"]
    },
    {
        id: SystemMessage1.NO_ITEM,
        label: ["物を売るときにアイテムを持っていない場合のメッセージ"]
    },
    {
        id: SystemMessage1.USE_ITEM,
        label: ["アイテムを使用するときの確認メッセージ"]
    },
    {
        id: SystemMessage2.CLICKABLE_ITEM,
        label: ["クリック型アイテムを取ったときのメッセージ (最初の一度のみ表示)"]
    },
    {
        id: SystemMessage2.FULL_ITEM,
        label: ["アイテムがこれ以上持てないときの確認メッセージ"]
    },
    {
        id: SystemMessage2.LOAD_SE,
        label: ["ゲームスタート時の効果音読み込みの確認メッセージ", "(「ON」で自動読み込み、「OFF」で読み込まずに開始を設定可)"]
    }
];

/**
 * システムメッセージのIDの配列を取得します。
 */
function getSystemMessageIds() {
    return AvailabeSystemMessages.map(labelItem => labelItem.id);
}

/**
 * システムメッセージに利用できる空の文字列の配列を作成します。
 */
function createEmptyMessages() {
    const messageIds = getSystemMessageIds();

    let emptyMessages: string[] = [];
    messageIds.forEach(messageId => emptyMessages[messageId] = "");

    return emptyMessages;
}

class SystemMessage extends React.Component<Props, SystemMessageField> {
    
    public static defaultProps: StateProps = {
        systemMessage: []
    }

    constructor(props: Props) {
        super(props);
        this.state = this.receive();
    }

    public componentDidUpdate(prevProps: StateProps) {
        if (this.props !== prevProps) {
            this.setState(this.receive());
        }
    }

    private receive(): SystemMessageField {
        if (this.props.systemMessage === null) {
            return {
                messages: createEmptyMessages()
            }
        }

        return {
            messages: this.props.systemMessage
        }
    }

    private send() {
        this.props.setSystemMessage({
            messages: this.state.messages
        });
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const targetMessageId = parseInt(event.target.name);
        if (!getSystemMessageIds().includes(targetMessageId)) {
            return;
        }

        // FIXME: setState のメソッドの中に直接 event.target.value で値を入れると event.target が無いと例外が起こる
        const messageValue = event.target.value;
        this.setState(prevState => {
            return {
                messages: {
                    ...prevState.messages,
                    [targetMessageId]: messageValue
                }
            };
        });
    }

    private handleResetButtonClick() {
        this.setState(this.receive());
    }

    public render() {
        const handleInputChange = this.handleInputChange.bind(this);

        return (
            <div>
                <Form>
                    {AvailabeSystemMessages.map((messageLabelItem, messageLabelIndex) => {
                        return (
                            <Form.Field key={messageLabelIndex}>
                                <label>
                                    {messageLabelItem.label.map((labelLine: string, labelIndex: number) => (
                                        <div key={labelIndex}>{labelLine}</div>
                                    ))}
                                </label>
                                <input
                                    type="text"
                                    name={`${messageLabelItem.id}`}
                                    value={this.state.messages[messageLabelItem.id]}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>
                        );
                    })}
                </Form>
                <Message>
                    <Message.Header>ゲーム中で使用される基本メッセージを変更することができます。</Message.Header>
                    <Message.List>
                        <Message.Item>標準のままで良いときは空白にしておいてください。</Message.Item>
                        <Message.Item>何も表示したくないときは <code>BLANK</code> (半角)と入力してください。</Message.Item>
                    </Message.List>
                </Message>
                <div>
                    <Button primary onClick={() => this.send()}>決定</Button>
                    <Button onClick={this.handleResetButtonClick.bind(this)}>リセット</Button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessage);
