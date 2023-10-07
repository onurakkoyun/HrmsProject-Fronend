import React from "react";
import { Modal, Header, Icon } from "semantic-ui-react";

export default function MessageModal({
  onClose,
  onOpen,
  open,
  content,
  success,
}) {
  return (
    <Modal
      basic
      dimmer
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      size="small"
    >
      <Header icon as="h2" className="orbitron">
        {success ? (
          <Icon name="check circle" color="green" />
        ) : (
          <Icon name="exclamation circle" color="red" />
        )}
        {content}
      </Header>
    </Modal>
  );
}
