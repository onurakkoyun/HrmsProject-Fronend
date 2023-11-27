import React from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'

export default function ApplyPopup({ onClose }) {
  return (
    <Modal open={true} style={{ width: 500 }}>
      <Modal.Header>
        <Icon name="exclamation circle" color="yellow" /> Warning
      </Modal.Header>
      <Modal.Content>
        <p>You must be logged in as a job seeker to perform this action!</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={onClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
