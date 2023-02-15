import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import "./adnan.css";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import VideoThumbnail from "react-video-thumbnail"; // use npm published version
import I from "../../assets/img/icons/common/profile.svg";
import { uploadFile } from "react-s3";
import ReactDatetime from "react-datetime";
import {
  Card,
  Input,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
  Label,
} from "reactstrap";
import CircularProgress from "@mui/material/CircularProgress";

import Picture from "../../assets/img/icons/common/Picture.svg";
import VideoCall from "../../assets/img/icons/common/VideoCall.svg";
// import { authData } from "store";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store";

window.Buffer = window.Buffer || require("buffer").Buffer;

//snapscams
const config = {
  bucketName: "snapscams",
  region: "us-west-2",
  accessKeyId: "AKIATMWYVTMPAZAN6DBI",
  secretAccessKey: "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",
};

const options = [
  { label: "Faking money-making oppurtunities" },
  { label: "Friend Account Recovery Scams" },
  { label: "Email Account Recovery Scams" },
  { label: "SnapChat Premium Scams" },
  { label: "Meet-ups Scams" },
  { label: "Romance Scams" },
];

function ScammerUsername() {
  const [{ user }] = useAuthStore();

  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
  };

  const history = useHistory();
  const [inputValues, setInputValues] = useState({
    snapchat_username: "",
    name: "",
    date: "",
    time: "",
    scamtype: "",
    description: "",
    images: [],
    videos: [],
  });

  const [imagesUploading, setImagesUploading] = useState(false);
  const [videosUploading, setVideosUploading] = useState(false);

  const upload = (e, name) => {
    name === "image" && setImagesUploading(true);
    let img = "";
    Array.from(e.target.files).forEach((v) => {
      uploadFile(v, config)
        .then((data) => {
          img = data.location;
        })
        .catch((err) =>
          Swal.fire({
            title: err || "Something Went Wrong",
            icon: "success",
            showConfirmButton: true,
            confirmButtonColor: "#3699FF",
            showCloseButton: true,
          })
        )
        .finally(() => {
          setInputValues((prev) => ({
            ...prev,
            ...(name === "image"
              ? { images: [...prev.images, img] }
              : { videos: [...prev.videos, img] }),
          }));
          name === "image"
            ? setImagesUploading(false)
            : setVideosUploading(false);
        });
    });
  };

  const onChangeHandler = (e, name) => {
    setInputValues({
      ...inputValues,
      ...(/(date|time)/.test(name)
        ? {
            [name]: moment(e).format(
              name === "date" ? "DD-MM-YYYY" : "hh:mm A"
            ),
          }
        : { [e.target.name || e.target.id]: e.target.value }),
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("inputvalues");
    try {
      // if (
      //   Object.values(inputValues).every((v) => v?.trim().length || v.length)
      // ) {
      const vals = JSON.stringify(inputValues);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASEURL}/scams/create`,
        vals,
        headersConfig
      );
      if (typeof data === "string") {
        Swal.fire({
          title: data,
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#3699FF",
          showCloseButton: true,
        });
      } else {
        Swal.fire({
          title: "Scam Created Successfully",
          icon: "success",
          showConfirmButton: true,
          confirmButtonColor: "#3699FF",
          showCloseButton: true,
        });
        history.push("/admin/home");
      }
    } catch (error) {
      Swal.fire({
        title: error || "Something Went Wrong",
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
      // console.log("err=====>", error);
    }
  };

  const removeHandler = (v, name) => {
    setInputValues((p) => ({
      ...p,
      [name]: p[name].filter((val) => val !== v),
    }));
  };

  return (
    <Container fluid>
      <Card className="br-10 p-4">
        <Row className="mt-2">
          <Col className="dadada" xs="12" md="2" sm="1" lg="1" xl="1">
            {/* <img
              src={localStorage.getItem("profile") || I}
              alt=""
              className="pro"
            /> */}
          </Col>
          <Col xs="12" md="1" sm="12" lg="11" xl="11">
            <FormGroup className="">
              <h2>Name </h2>
              <Input
                className="form-control-lg scm"
                placeholder=""
                onChange={onChangeHandler}
                type="text"
                id="name"
                name="name"
              />
            </FormGroup>
            <FormGroup className="">
              <h2>Scammer Username </h2>
              <Input
                className="form-control-lg scm"
                placeholder=""
                onChange={onChangeHandler}
                type="text"
                id="snapchat_username"
                name="snapchat_username"
              />
            </FormGroup>
            <Row className="mt-2">
              <Col md="4" lg="4" xl="4">
                <FormGroup>
                  <ReactDatetime
                    className="datepicker"
                    onChange={(e) => onChangeHandler(e, "date")}
                    inputProps={{
                      placeholder: "Select a day",
                      name: "date",
                      id: "date",
                    }}
                    timeFormat={false}
                  />
                </FormGroup>
              </Col>
              <Col md="4" lg="4" xl="4">
                <FormGroup>
                  <ReactDatetime
                    // input={false}
                    onChange={(e) => onChangeHandler(e, "time")}
                    className="timepicker"
                    inputProps={{
                      placeholder: "Select a time",
                      name: "time",
                      id: "time",
                    }}
                    dateFormat={false}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mt-2">
              <h2>Type of scam </h2>
              <CreatableSelect
                className="react-select br-10"
                placeholder=""
                isClearable
                options={options}
                onChange={(e) =>
                  setInputValues((p) => ({ ...p, scamtype: e?.label || "" }))
                }
              />
            </FormGroup>
            <FormGroup className="mt-2">
              <h2>Description of what happend</h2>
              <Input
                className="form-control-lg scm"
                placeholder=""
                type="textarea"
                name="description"
                id="description"
                onChange={onChangeHandler}
              />
            </FormGroup>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              onChange={(e) => {
                upload(e, "image");
              }}
              accept=".png, .jpg, .jpeg"
              style={{ display: "none" }}
            />
            <input
              id="video"
              name="video"
              type="file"
              multiple
              accept="video/mp4,video/x-m4v,video/*"
              onChange={(e) => {
                setVideosUploading(true);
                upload(e);
              }}
              style={{ display: "none" }}
            />
            <Row className="mt-2">
              <Col className="upload-btn" md="3" lg="3" xl="3">
                {imagesUploading ? (
                  <CircularProgress style={{ color: "white" }} />
                ) : (
                  <>
                    <Label className="lbl" for="images">
                      Attach Photo
                    </Label>
                    <img src={Picture} className="" />
                  </>
                )}
              </Col>
              <Col className="upload-btn" md="3" lg="3" xl="3">
                {videosUploading ? (
                  <CircularProgress style={{ color: "white" }} size={20} />
                ) : (
                  <>
                    {" "}
                    <Label className="lbl" for="video">
                      Attach Video
                    </Label>
                    <img src={VideoCall} className="" />
                  </>
                )}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="crd" md="6" lg="6" xl="6" xs="12" sm="12">
                {!!inputValues.images.length && (
                  <div className="flex-row">
                    {inputValues.images.map((v) => (
                      <div className="uploadedimage" key={v}>
                        <i
                          className="fa fa-window-close"
                          onClick={() => removeHandler(v, "images")}
                          aria-hidden="true"
                        ></i>
                        <img width="100" height="100" alt={v} key={v} src={v} />
                      </div>
                    ))}
                  </div>
                )}
              </Col>
              <Col className="crd" md="4" lg="4" xl="4" xs="12" sm="12">
                {!!inputValues.videos.length && (
                  <div style={{ flexDirection: "row", display: "flex" }}>
                    {inputValues.videos.map((v) => (
                      <div className="videomain uploadedimage" key={v}>
                        <i
                          className="fa fa-window-close"
                          onClick={() => removeHandler(v, "videos")}
                          aria-hidden="true"
                        ></i>
                        <VideoThumbnail
                          videoUrl={v}
                          width={100}
                          style={{}}
                          height={100}
                          className="uploadedimage"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
            <Button
              onClick={submit}
              disabled={imagesUploading || videosUploading}
              className="btn-submit"
              type="button"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ScammerUsername;
