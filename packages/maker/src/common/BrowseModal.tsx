import React from "react";
import { Button, Modal } from "semantic-ui-react";

/**
 * 参照選択の際に使用されるモーダルのコンポーネントです。
 * @returns モーダルコンポーネント
 */
const BrowseModal: React.FC<{
    /** タイトルテキスト */
    title: string
    /** 開いているかどうか？ */
    isOpen: boolean,
    /** 「決定」を押した際に実行されるメソッド */
    onSubmit?: () => void,
    /** 閉じた際に実行されるメソッド */
    onClose: () => void
}> = props => {
    return (
        <Modal
            open={props.isOpen}
            onClose={props.onClose}
        >
            <Modal.Header>{props.title}</Modal.Header>
            <Modal.Content scrolling>{props.children}</Modal.Content>
            <Modal.Actions>
                {props.onSubmit &&
                    <Button
                        primary
                        onClick={() => {
                            if (props.onSubmit) {
                                props.onSubmit();
                            }
                            props.onClose();
                        }}
                    >決定</Button>
                }
                <Button
                    secondary
                    onClick={() => {
                        props.onClose();
                    }}
                >キャンセル</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default BrowseModal;
