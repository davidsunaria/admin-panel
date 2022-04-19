import React from "react";
import { ModalHeader, ModalFooter, Button, Modal, ModalBody } from "reactstrap";

interface IModal {
  children: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  onSubmit?: () => void;
  heading: String;
  showSubmitBtn: boolean;
}
const MyModal: React.FC<IModal> = ({ children, isOpen, toggle, onSubmit, heading, showSubmitBtn }) => (
<div>
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {heading}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      {showSubmitBtn && <ModalFooter>
        <Button
          color="primary"
          onClick={onSubmit}
        >
          Submit
        </Button>
        {' '}
        <Button onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>}
    </Modal>
  </div>
);

export default MyModal;