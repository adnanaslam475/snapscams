import React, { useEffect } from "react";
import { Container, Row } from "reactstrap";
import CardsHeader from "components/Headers/CardsHeader.js";
import ScammerTable from "components/ScammerTable";

function Home() {

  return (
    <>
      <CardsHeader name="" parentName="Widgetds" />
      <Container className="mt--6" fluid>
        <Row>
          <ScammerTable />
        </Row>
      </Container>
    </>
  );
}

export default Home;
