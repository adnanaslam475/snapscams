import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
} from "reactstrap";

function CardsHeader({ name, editprofile, data, loading = true }) {
  return (
    <>
      <div className="header pb-6 bg-blue" style={{ marginTop: "-1px", position: 'relative' }}>
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6" xs="7">
                <h6 className="h2 text-white d-inline-block mb-0">{name}</h6>{" "}
              </Col>
              <Col className="text-right" lg="6" xs="5"></Col>
            </Row>

            <Row>
              <Col md="6" xl="3"></Col>
              <Col md="6" xl="3"></Col>
              <Col md="6" xl="3"></Col>
              <Col md="6" xl="3"></Col>
            </Row>
          </div>
          {editprofile && (!data?.username || !data?.snapchat_username) && !loading && < h4 style={{ color: 'white' }}> We just need a little more information to finish creating your account!</h4>}
        </Container>
      </div>
    </>
  );
}

CardsHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default CardsHeader;
