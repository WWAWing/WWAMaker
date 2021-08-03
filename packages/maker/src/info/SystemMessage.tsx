import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SystemMessage1, SystemMessage2, SystemMessageType } from "../classes/WWAData";
import { setSystemMessage } from "../wwadata/WWADataState";
import { Form, Message, Button, Icon } from "semantic-ui-react";

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

    let emptyMessages: string[] = messageIds.map(() => "");
    return emptyMessages;
}

const SystemMessage: React.FC = () => {

    const [editingField, updateEditingField] = useState<string[]>(createEmptyMessages());
    
    const systemMessages = useSelector(state => state.wwaData?.systemMessage) ?? null;
    const dispatch = useDispatch();

    const receive: () => string[] = () => {
        return systemMessages ?? createEmptyMessages();
    };

    const send = () => {
        dispatch(setSystemMessage(editingField));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetMessageId = parseInt(event.target.name);
        if (!getSystemMessageIds().includes(targetMessageId)) {
            return;
        }

        // FIXME: setState のメソッドの中に直接 event.target.value で値を入れると event.target が無いと例外が起こる
        const messageValue = event.target.value;
        
        // TODO: setState メソッドにあった prevState が関数コンポーネントには多分ないので、挙動が変わるかもしれない
        const newMessages = editingField.slice();
        newMessages[targetMessageId] = messageValue;
        updateEditingField(newMessages);
    }

    const handleResetButtonClick = () => {
        updateEditingField(receive());
    }

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
                                value={editingField[messageLabelItem.id]}
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
                <Button primary onClick={send}>
                    <Icon name="check" />
                    決定
                </Button>
                <Button onClick={handleResetButtonClick}>
                    <Icon name="check" />
                    リセット
                </Button>
            </div>
        </div>
    );
}

export default SystemMessage;
