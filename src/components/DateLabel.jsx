import React from "react";
import { Label, Grid, Header } from "semantic-ui-react";

export default function DateLabel({ value }) {
  return (
    <div className="date">
      <Grid columns={2} verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={16}>
            <Label circular basic color="blue">
              <span className="orbitron">{value}</span>
            </Label>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
