import React from "react";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

function AuthFooter() {

  return (
    <>
      <footer className="py-5" id="footer-main">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="12" xs="12" sm="12" lg="12" md='12'>
              <Nav style={{ justifyContent: 'space-evenly' }} className="nav-footer justify-content-center spc">
                <NavItem>
                  <NavLink
                    to="/tos"
                    tag={Link}
                  >
                    Terms of service
                  </NavLink>
                </NavItem>
                <Divider flexItem style={{ width: '3px' }} orientation="vertical" />
                <NavItem>
                  <NavLink
                    to="/privacy"
                    tag={Link}
                  >
                    Privacy Policy
                  </NavLink>
                </NavItem>

          
                <Divider flexItem style={{ width: '3px' }} orientation="vertical" />

                <NavItem>
                  <NavLink
                    to="/safety"
                    tag={Link}
                  >
                    Trust & Safety
                  </NavLink>
                </NavItem>

              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default AuthFooter;
