import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select";
import classnames from "classnames";
import Swal from "sweetalert2";
import axios from "axios";
import "./index.css";
import AuthFooter from "components/Footers/AuthFooter.js";
import { useAuthStore } from "store";
import routes from "routes.js";
import D from "../../src/assets/img/icons/common/dashboard.svg";

import {
  Card,
  Col,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
} from "reactstrap";
// import I from "../../src/assets/img/icons/common/profile.svg";

import Sidebar from "components/Sidebar/Sidebar";
import { useDebounce } from "components/Navbars/AdminNavbar";
import { useHistory } from "react-router-dom";

function Dashboard() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);

  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const [{ user }, dispatch] = useAuthStore();
  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
  };

  const toggleSidenav = (e) => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    setSidenavOpen(!sidenavOpen);
  };

  const filter = async (value) => {
    setLoading(true);
    if (value?.trim().length) {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASEURL}/user/search?search=${value}`,
          headersConfig
        );
        setOptions(data.map((v) => ({ label: v._id })));
      } catch (error) {
        Swal.fire({
          title: error || "Something Went Wrong",
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#3699FF",
          showCloseButton: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const debounceInput = useDebounce(value, 500);
  useEffect(() => {
    if (value) filter(value);
  }, [debounceInput]);

  // useEffect(() => {
  //   window.history.replaceState({}, '', '/');
  // }, [])


  // if (!user?.token) {
  //   history.push("/auth/login");
  // }

  return (
    <>
      <Sidebar
        routes={routes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: "/",
          imgSrc: require("assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <Navbar
        style={{ position: "relative", width: "max-content" }}
        className={classnames("navbar-top navbar-expand border-bottom bg-blue")}
      >
        <Nav
          style={{ position: "absolute", top: 20, right: 20 }}
          className=""
          navbar
        >
          <UncontrolledDropdown nav>
            <DropdownToggle
              style={{ cursor: "pointer", color: "white" }}
              className="nav-link pr-0"
              color=""
              tag="a"
            >
              {/* <Media className="ml-2 d-none d-lg-block">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    className=""
                    style={{ height: "100%" }}
                    src={localStorage.getItem("profile_image") || I}
                  />
                </span>
              </Media> */}
            </DropdownToggle>

          </UncontrolledDropdown>
        </Nav>
        <Container style={{ height: "300px", border: '1px solid red' }} fluid>
          <Row className="wlcm-row">
            <div className="wlcm">
              <h1> Welcome to SnapScams</h1>
            </div>
            <AsyncSelect
              placeholder="Look up a username..."
              noOptionsMessage={() => (loading ? "Searching..." : null)}
              options={options}
              className="async_select b-1"
              inputValue={value}
              isClearable={false}
              onChange={(e) => {
                dispatch({ type: "SCAMMER_ID", payload: e.label });
                setValue(e.label);
                history.push("/admin/search", { snapchat_username: e.label });
              }}
              onInputChange={(v) => setValue(v)}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "2rem 1.5rem 2rem 1.5rem",
                  boxShadow: "none",
                }),
                option: (base) => ({
                  ...base,
                  fontSize: "20px",
                  fontWeight: "bold",
                }),
              }}
            />
          </Row>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row>
          <Col md="6" sm="6" xs="12" className="" lg="6" xl="6">
            <Card className="p-5">
              <img
                src={D}
                style={{ height: "200px" }}
                className="dsh-img"
                alt=""
              />
              <p style={{ wordBreak: "break-all" }}>
                sfddddddddddddddddddddddddddddddddddddddddddd
                sfddddddddddddddddddddddddddddddddddddddddddd
                sfddddddddddddddddddddddddddddddddddddddddddd
                sfddddddddddddddddddddddddddddddddddddddddddd
              </p>
            </Card>
          </Col>
          <Col md="6" sm="6" xs="12" className="d-flex" lg="6" xl="6">
            <Card className="p-5">
              <h1>About SnapScams</h1>
              <p style={{ wordBreak: "break-all" }}>
                sfdddsddddddddddddddddddddddddddddddddddddddddddddddd.
                sfdddsddddddddddddddddddddddddddddddddddddddddddddddd
                sfdddsddddddddddddddddddddddddddddddddddddddddddddddd
                sfdddsddddddddddddddddddddddddddddddddddddddddddddddd
                sfdddsddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddddddd
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
      <AuthFooter />
    </>
  );
}

export default Dashboard;
