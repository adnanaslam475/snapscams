import React from "react";
import Chart from "chart.js";

import { Container, Row, } from "reactstrap";

import CardsHeader from "components/Headers/CardsHeader.js";

import { chartOptions, parseOptions } from "variables/charts.js";
import ScammerUsername from "components/ScammerUsername/ScammerUsername";

function Post() {
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  return (
    <>
      <CardsHeader name="Post" parentName="Post" />
      <Container className="mt--6" fluid>
        <Row>
          <ScammerUsername />
        </Row>
      </Container>
    </>
  );
}

export default Post;
