import React, { useEffect, useState } from "react";
import "./AdminNavbar.css";
import classnames from "classnames";
import PropTypes from "prop-types";
import AsyncSelect from "react-select";

import Swal from "sweetalert2";
import axios from "axios";
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Media,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";
import I from "../../assets/img/icons/common/profile.svg";
import { useHistory, useLocation } from "react-router-dom";
import { authData } from "store";
import { useAuthStore } from "store";

export const colourOptions = [];

export function useDebounce(value, wait = 200) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, wait);
    return () => clearTimeout(timer);
  }, [value, wait]);
  return debounceValue;
}

function AdminNavbar({ theme, sidenavOpen, toggleSidenav }) {
  const loc = useLocation();

  const [{ user }, dispatch] = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const history = useHistory();

  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
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
  console.log('loc.pa', loc.pathname)
  return (
    <>
      <Navbar style={{ border: "", display: ['/admin/home', '/'].includes(loc.pathname) && 'none' }}
        className={classnames("navbar-top navbar-expand border-bottom bg-blue")}
      >
        <Container fluid >
          <Collapse style={{ padding: "0 25% 0 25%" }} navbar isOpen={true}>
            {loc.pathname.includes("edit-profile") ? (
              <h1 style={{ color: "white" }}>Edit Profile</h1>
            ) : (
              <Form
                className={classnames("navbar-search form-inline mr-sm-3", {
                  "navbar-search-light": theme === "dark",
                })}
              >
                <AsyncSelect
                  // menuIsOpen={true}
                  placeholder="Search"
                  noOptionsMessage={() => (loading ? "Searching..." : null)}
                  options={options}
                  className="async_select b-1"
                  inputValue={value}
                  isClearable={false}
                  onChange={(e) => {
                    dispatch({ type: "SCAMMER_ID", payload: e.label });
                    setValue(e.label);
                    !window.location.pathname.includes("/admin/search") &&
                      history.push("/admin/search");
                  }}
                  onInputChange={(v) => {
                    setValue(v);
                  }}
                  styles={{
                    input: (styles) => ({
                      ...styles,
                      // ...dot()
                    }),
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
                <button
                  aria-label="Close"
                  className="close"
                  type="button"
                  onClick={""}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </Form>
            )}

            <Nav className="align-items-center ml-md-auto" navbar>
              <NavItem className="d-xl-none">
                <div
                  className={classnames(
                    "pr-3 sidenav-toggler",
                    { active: sidenavOpen },
                    { "sidenav-toggler-dark": theme === "dark" }
                  )}
                  onClick={toggleSidenav}
                >
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                  </div>
                </div>
              </NavItem>
              <NavItem className="d-sm-none">
                <NavLink>
                  <i className="ni ni-zoom-split-in" />
                </NavLink>
              </NavItem>
            </Nav>
            <Nav
              style={{ display: "none" }}
              className="align-items-center ml-auto ml-md-0"
              navbar
            >
              <UncontrolledDropdown nav>
                <DropdownToggle className="nav-link pr-0" color="" tag="a">
                  <Media className="align-items-center">
                    {/* <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..." className="" style={{ height: '100%' }}
                        src={localStorage.getItem('profile')}
                      />
                    </span> */}
                    <Media
                      style={{ cursor: "pointer", color: "white" }}
                      className="ml-2 d-none d-lg-block"
                    >
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          className=""
                          style={{ height: "100%" }}
                          src={localStorage.getItem("profile") || I}
                        />
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="noti-title" header tag="div">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          className=""
                          style={{ height: "100%" }}
                          src={localStorage.getItem("profile") || I}
                        />
                      </span>
                      <h6 className="text-overflow m-3">Welcome!</h6>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push("/admin/edit-profile");
                    }}
                  >
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem
                    onClick={() => {
                      localStorage.clear();
                      dispatch({ type: "AUTH", payload: null });
                      history.push("/auth/login");
                    }}
                  >
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => { },
  sidenavOpen: false,
  theme: "dark",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default AdminNavbar;
