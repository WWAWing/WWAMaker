import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ipcRenderer } from "electron";
import { Modal } from "semantic-ui-react";
import { closeModal } from "./ModalState";
import TestPlay from "./TestPlay";

const ModalComponent: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const isOpened = useSelector(state => state.modal.open);
    const mode = useSelector(state => state.modal.open ? state.modal.mode : "");

    const ContentComponent: React.FC<{ currentMode: typeof mode }> = props => {
        switch (props.currentMode) {
            case "TESTPLAY":
                return <TestPlay />;
            default:
                return null;
        }
    };

    const onClose = () => {
        ipcRenderer.send('testplay-close');
        dispatch(closeModal());
    };

    return (
        <Modal
            closeIcon
            open={isOpened}
            onClose={onClose}
        >
            <Modal.Content>
                <ContentComponent currentMode={mode} />
            </Modal.Content>
        </Modal>
    );
};

export default ModalComponent;
