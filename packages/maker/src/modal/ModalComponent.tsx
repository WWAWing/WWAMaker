import React from "react";
import { useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";

const ModalComponent: React.FC<{}> = () => {
    const isOpened = useSelector(state => state.modal.open);

    return (
        <Modal
            open={isOpened}
        >
            
        </Modal>
    );
};

export default ModalComponent;
