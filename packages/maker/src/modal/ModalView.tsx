import React from "react";
import { Modal } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { ModalState } from "./ModalStates";

/**
 * Modal の表示について
 *     Modal の内容は ModalState.type によって大きく異なるため、 type に従って内容を描画するようにしています。
 */
const ModalView: React.FC<{}> = () => {
    const modalType = useSelector(state => state.modal.type);
    const ModalContent = ModalContentTable[modalType];

    return (
        <Modal
            open={modalType !== "NONE"}
        >
            <ModalContent />
        </Modal>
    );
};

/**
 * Modal の内容表示を定義するコンポーネントの型です。
 */
type ModalContentComponent = React.FC<{}>;

const ModalContentTable: { [type in ModalState["type"]]: ModalContentComponent } = {
    "NONE": () => <></>,
    "ERROR": () => <></>
};

export default ModalView;
