import React from "react";
import { Container, Divider, Segment, Header } from "semantic-ui-react";

export default function ContentTitle({ content }) {
  return (
    <Container className="contentTitle">
      <br />
      <br />
      <br />
      <Segment basic>
        <Header color="grey" as="h5" textAlign="left">
          <span className="contentTitle-1">{content}</span>
        </Header>
      </Segment>
      <Divider />
    </Container>
  );
}
