import React, { useState } from "react";
import axios from "axios";
import classnames from "classnames";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { headersConfig } from "components/ScammerUsername/ScammerUsername";
import Swal from "sweetalert2";
import { useAuthStore } from "store";

export const config = { headers: { "Content-Type": "application/json" } };
function Login() {
  const history = useHistory();
  const [{ user }, dispatch] = useAuthStore();
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name || e.target.id]: e.target.value,
    });
  };

  if (user?.token) {
    history.push('/admin/home')
  }
  const loginSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const vals = JSON.stringify(inputValues);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASEURL}/users/login`,
        vals,
        config
      );
      if (typeof data === "object") {
        dispatch({ type: "AUTH", payload: data?.value });
        localStorage.setItem("user", JSON.stringify(data?.value || {}));
        return history.push("/");
      }
      Swal.fire({
        title: data,
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        title: error || "Scam user create Successfully",
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="login align-items-center d-flex">
      <Container className="">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-3">
                  <small>Sign in with</small>
                </div>
                <div className="btn-wrapper text-center">
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/github.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button>
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/google.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Or sign in with credentials</small>
                </div>
                <Form onSubmit={loginSubmit} role="form">
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        id="email"
                        value={inputValues.email}
                        onChange={onChangeHandler}
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(true)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={inputValues.password}
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(true)}
                        onChange={onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      // onClick={loginSubmit}
                      color="info"
                      disabled={loading}
                      type="submit"
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row className="mt-3">
              <Col xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Forgot password?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  onClick={() => history.push("/auth/register")}
                >
                  <small style={{ color: "black" }}>Create new account</small>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
