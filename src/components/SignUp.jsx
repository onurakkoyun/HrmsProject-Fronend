import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Header, Icon, Modal, Segment } from "semantic-ui-react";
import { Button } from "@material-tailwind/react";

export default function SignUp({ open, setOpen }) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  const handleModal = (value) => {
    setModalOpen(value);
    // Modal'ı kapatırken, dışarıya bildiriyoruz
    setOpen(value);
  };

  return (
    <span>
      <Modal
        basic
        dimmer
        onClose={() => handleModal(false)}
        onOpen={() => handleModal(true)}
        open={modalOpen}
        size="small"
      >
        <Header icon as="h2" className="orbitron">
          <Icon name="compass" />
          What type of account do you want to create ?
        </Header>

        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column width={7}>
                <Link to={"/employee/add"}>
                  <Button
                    className="rounded-full"
                    color="blue"
                    onClick={() => handleModal(false)} // Modal'ı kapatmak için modalOpen state'ini kullanın
                  >
                    Employee
                  </Button>
                </Link>
              </Grid.Column>
              <Grid.Column>
                <Segment basic className="or">
                  <span className="ml-2">or</span>
                </Segment>
              </Grid.Column>
              <Grid.Column width={5}>
                <Link to={"/employer/add"}>
                  <Button
                    className="rounded-full"
                    color="green"
                    onClick={() => handleModal(false)} // Modal'ı kapatmak için modalOpen state'ini kullanın
                  >
                    Employer
                  </Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </span>
  );
}
