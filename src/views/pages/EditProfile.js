import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import Swal from "sweetalert2";
import axios from "axios";
import I from '../../assets/img/icons/common/profile.svg'

import {
  Card,
  Input,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

import { uploadFile } from "react-s3";
import CardsHeader from "components/Headers/CardsHeader";
import { Checkbox } from "@mui/material";
import { useAuthStore } from "store";
import { useHistory } from "react-router-dom";

window.Buffer = window.Buffer || require("buffer").Buffer;

//snapscams
const config = {
  bucketName: "snapscams",
  region: "us-west-2",
  accessKeyId: "AKIATMWYVTMPAZAN6DBI",
  secretAccessKey: "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",
};

function EditProfile() {
  const [{ user }] = useAuthStore();
  const history = useHistory();
  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
  };
  const [data, setdata] = useState(null);
  const [inputValues, setInputValues] = useState({
    name: "",
    last_name: "",
    username: "",
    snapchat_username: "",
    email: "",
    profile_image: "",
    signup_newsletter: false,
  });
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const upload = () => {
    document.getElementById("profile").click();
    const b = document.getElementById("profile").files;
    if (b[0] !== undefined) {
      setLoading(true);
      uploadFile(b[0], config)
        .then((data) => {
          setInputValues((p) => ({ ...p, profile_image: data.location }));
        })
        .catch((err) => {
          Swal.fire({
            title: err || "Something Went Wrong",
            icon: "success",
            showConfirmButton: true,
            confirmButtonColor: "#3699FF",
            showCloseButton: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onChangeHandler = (e) => {
    setInputValues((p) => ({
      ...p,
      [e.target.name || e.target.id]:
        e.target.name === "signup_newsletter"
          ? e.target.checked
          : e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const datas = JSON.stringify(inputValues);
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BASEURL}/update_profile/${user._id}`,
        datas,
        headersConfig
      );
      if (data?.success == false) {
        return Swal.fire({
          title: data?.msg,
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#3699FF",
          showCloseButton: true,
        });
      }
      Swal.fire({
        title: "Update user successfully",
        icon: "success",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
      localStorage.setItem("profile_image", inputValues.profile_image);
      history.push("/admin/home");
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
  };

  const func = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/user/edit/${user._id}`,
        headersConfig
      );
      setInputValues((p) => ({ ...p, ...data }));
      setdata(data);
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
  };

  const reportedBy = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/user/reported_by`,
        headersConfig
      );
      setCount(data);
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
  };

  useEffect(() => {
    func();
    reportedBy();
  }, []);

  if (!user?.token) {
    history.push('/auth/login')
  }

  return (
    <>
      <CardsHeader
        name=""
        loading={loading}
        editprofile
        data={data}
        parentName=""
      />
      <Container fluid className="mt--5">
        <Card className="br-10 p-4">
          <Row>
            <Col xs="12" md="8" sm="12" lg="8" xl="8">
              <div className="flex-column">
                My account
                <h3>USER INFORMATION</h3>
              </div>
              <Row>
                {[
                  { lable: "First Name", name: "name" },
                  { lable: "Last Name", name: "last_name" },
                  { lable: "User name", name: "username" },
                  { lable: "Snapchat User Name", name: "snapchat_username" },
                  { lable: "Email Address", name: "email" },
                ].map((v) => (
                  <Col
                    xs="12"
                    key={v.name}
                    md={v.name === "email" ? "12" : "6"}
                    xl={v.name === "email" ? "12" : "6"}
                    lg={v.name === "email" ? "12" : "6"}
                    sm="12"
                  >
                    {" "}
                    <FormGroup key={v.lable} className="">
                      <h2>{v.lable} </h2>
                      <Input
                        className="form-control-lg scm"
                        placeholder={v.lable}
                        type="text"
                        value={inputValues[v.name]}
                        name={v.name}
                        id={v.name}
                        onChange={onChangeHandler}
                      />
                    </FormGroup>
                  </Col>
                ))}
                <FormGroup className="">
                  <Button className="" onClick={submit}>
                    Save and go to dashboard
                  </Button>
                </FormGroup>
              </Row>
            </Col>
            <Col xs="12" md="4" sm="12" lg="4" xl="4">
              <Card
                style={{
                  height: "250px",
                  justifyContent: "space-around",
                }}
              >
                <div className="outer_profile"
                >
                  <img
                    alt=""
                    src={inputValues.profile_image || I}
                    style={{ cursor: 'pointer' }}
                    className="profile_img"
                    onClick={upload}
                  />
                </div>
                <input
                  type="file"
                  className="d-none"
                  id="profile"
                  name="profile"
                />
                <div className="d-flex reported">
                  <span className="flex-column">
                    <b>{count?.reported_by || 0}</b>
                    <h6>Reported by</h6>
                  </span>
                  <span className="flex-column">
                    <b>{count?.scam_revealed || 0}</b>
                    <h6>Scam reported</h6>
                  </span>
                  <span className="flex-column">
                    <b>{count?.comments || 0}</b>
                    <h6>Comments</h6>
                  </span>
                </div>
              </Card>
              <Card style={{ padding: "50px" }}>
                <h2> Sign up for newsletter</h2>
                <div className="d-flex">
                  <Checkbox
                    className="checkbox"
                    name="signup_newsletter"
                    id="signup_newsletter"
                    checked={inputValues.signup_newsletter}
                    onChange={onChangeHandler}
                  />
                  To hear from us periodically about trends, statistics, and how
                  to stay safe online, subscribe to our newsletter!
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

export default EditProfile;
