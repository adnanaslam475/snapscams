import React, { useEffect, useRef, useState } from "react";
import "./EditProfile.css";
import Swal from "sweetalert2";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import moment from "moment";
import Slider from "react-slick";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { Card, Input, Container, Row, Col, Button } from "reactstrap";
import CardsHeader from "components/Headers/CardsHeader";
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
// import Picture from "../../assets/img/icons/common/Picture.svg";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "store";

window.Buffer = window.Buffer || require("buffer").Buffer;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ScamReportPage() {
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [open, setopen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [margin, setMargin] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState(0);

  const [votes, setVotes] = useState([]);
  const [scam, setscam] = useState({});
  const [{ user }] = useAuthStore();
  // const history = useHistory();
  const location = useLocation();
  const [, , , id] = location.pathname.split("/");

  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
  };

  const getFullScamReport = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/scam_report/${id}`,
        headersConfig
      );
      setscam(data);
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

  const getAllComments = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/comments/${id}`,
        headersConfig
      );
      setComments(data);
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

  const getVotes = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/votes/${id}`,
        headersConfig
      );
      setVotes(data);
    } catch (error) {
      Swal.fire({
        title: error || "Something Went Wrong",
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
    }
  };

  const submitVote = async (vote) => {
    setDisabled(true);
    try {
      const vals = JSON.stringify({
        vote,
        createdBy: user._id,
        scammer: scam.snapchat_username,
        scamId: id,
      });
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASEURL}/vote`,
        vals,
        headersConfig
      );
      if (
        votes.find((v) => v.createdBy === user._id) !== undefined &&
        vote === ""
      ) {
        setVotes(votes.filter((v) => v.createdBy !== user._id));
      } else if (votes.find((v) => v.scamId === id) !== undefined && vote) {
        const update = [
          ...votes.filter(
            (v) => v.createdBy.toString() !== user._id.toString()
          ),
        ];
        const updatedVote = {
          ...(votes.find(
            (v) => v.createdBy.toString() === user._id.toString()
          ) || data),
          vote,
        };
        update.push(updatedVote);
        setVotes(update);
      } else {
        setVotes((p) => [...p, data]);
      }
    } catch (error) {
      Swal.fire({
        title: error || "Something Went Wrong",
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    getFullScamReport(id);
    getAllComments(id);
    getVotes(id);
  }, [id]);

  const commentCreateHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const vals = JSON.stringify({
        comment,
        scamId: id,
        scammer: scam?.snapchat_username,
        createdBy: user?._id,
        createdAt: new Date(),
      });
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASEURL}/comments/create`,
        vals,
        headersConfig
      );
      setComment("");
      setComments((p) => [...p, data]);
      ref.current?.scrollIntoView({ behavior: "smooth", block: 'start' });
      setMargin(true)
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
  const theme = useTheme();

  return (
    <>
      <CardsHeader name="Post" parentName="Post" />
      <Container className="mt--6" fluid>
        <Card className="br-10 p-5">
          <Row style={{ minHeight: "200px" }}>
            <Col md="9" sm="6" className="flex-column" xs="12" lg="9" xl="9">
              <h1 style={{ fontWeight: "bold" }}>{scam?.snapchat_username}</h1>
              <h2 className="mt-3">{scam?.scamtype}</h2>
            </Col>
            <Col md="3" sm="6" xs="12" lg="3" xl="3">
              <h1>{scam?.date}</h1>
              <h3>{scam?.time}</h3>
            </Col>
          </Row>
          <Divider flexItem orientation="horizontal" />
          <Row style={{ minHeight: "200px" }}>
            <Col
              md="9"
              sm="6"
              className="flex-column p-4"
              xs="12"
              lg="9"
              xl="9"
            >
              <p>{scam?.description}</p>
            </Col>
            <Col md="3" sm="6" xs="12" className="imgcol p-4" lg="3" xl="3">
              <Button onClick={() => setopen(true)}>See Images/videos</Button>
              {/* <img
                className="imgs"
                src={scam?.images?.length ? scam?.images[0] : Picture}
                alt=""
              /> */}
            </Col>
          </Row>
          <Divider flexItem orientation="horizontal" />
          <Row style={{ border: "1px solid lightgray" }}>
            <Col md="6" sm="6" xs="12" lg="6" xl="6">
              <div className="votes">
                <IconButton
                  disabled={disabled || !user?.token}
                  onClick={() => {
                    submitVote(
                      votes.find(
                        (v) => v.createdBy.toString() == user._id.toString()
                      ) == undefined ||
                        votes.find(
                          (v) => v.createdBy.toString() == user._id.toString()
                        )?.vote === "d"
                        ? "u"
                        : ""
                    );
                  }}
                  className="icn"
                >
                  {votes.find((v) => v.createdBy == user._id && v.vote == "u")
                    ?.createdBy ? (
                    <ThumbUpAltIcon fontSize="small" />
                  ) : (
                    <ThumbUpOffAltIcon fontSize="small" />
                  )}
                </IconButton>
                {votes.filter((v) => v.vote === "u").length} upvotes
              </div>
            </Col>
            <Col md="6" sm="6" xs="12" lg="6" xl="6">
              <div className="votes">
                <IconButton
                  className="icn"
                  disabled={disabled || !user?.token}
                  onClick={() => {
                    submitVote(
                      votes.find(
                        (v) => v.createdBy.toString() === user._id.toString()
                      ) == undefined ||
                        votes.find(
                          (v) => v.createdBy.toString() === user._id.toString()
                        )?.vote === "u"
                        ? "d"
                        : ""
                    );
                  }}
                >
                  {votes.find((v) => v.createdBy == user._id && v.vote == "d")
                    ?.createdBy ? (
                    <ThumbDownAltIcon fontSize="small" />
                  ) : (
                    <ThumbDownOffAltIcon fontSize="small" />
                  )}
                </IconButton>
                {votes.filter((v) => v.vote === "d").length} Downvotes
              </div>
            </Col>
          </Row>
          <Row className="comments-row">
            <Col md="12" sm="12" xs="12" lg="12" xl="12" onWheel={() => { if (margin) setMargin(false) }}>
              {comments.map((v, idx) => {
                return (
                  <div ref={ref} key={v._id}
                    style={{
                      marginBottom: margin && idx == comments.length - 1 ? '130px' : '',
                    }}
                    className="comments">
                    <div className="flex-column">
                      <div className="d-flex flex-row">
                        <h3>{v?.scammer || ""}</h3>
                        <span className="ml-2" style={{ whiteSpace: "nowrap" }}>
                          {moment(v?.createdAt).fromNow()}
                        </span>
                      </div>
                      <p>{v.comment}</p>
                    </div>
                    <p className="">
                      {moment(v?.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </div>
                )
              })}
            </Col>
            <form className="comment-form" onSubmit={commentCreateHandler}>
              <Input
                placeholder="Write a comment..."
                disabled={loading || !user?.token}
                value={comment}
                className="comment_input"
                onChange={(e) => setComment(e.target.value)}
              />
            </form>
          </Row>
        </Card>
      </Container>
      <Dialog
        open={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClose={() => setopen(false)}
        onBackdropClick={() => setopen(false)}
      >
        <DialogTitle>Media</DialogTitle>
        <DialogContent style={{}}>
          <Box sx={{ bgcolor: "background.paper", width: 500 }}>
            <AppBar position="static">
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Images" {...a11yProps(0)} />
                <Tab label="Videos" {...a11yProps(1)} />
              </Tabs>
            </AppBar>

            <SwipeableViews
              style={{ overflow: "clip" }}
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={tab}
            >
              <TabPanel value={tab} index={0}>
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  className=""
                // lazyLoad
                >
                  {scam?.images?.map((v) => (
                    <div
                      className="uploadedimage"
                      style={{ width: "100%", height: "100%" }}
                      key={v}
                    >
                      <img
                        style={{ width: "100%", height: "100%" }}
                        alt={v}
                        key={v}
                        src={v}
                      />
                    </div>
                  ))}
                </Slider>
              </TabPanel>
              <TabPanel value={tab} index={1} dir={theme.direction}>
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  className=""
                  lazyLoad
                >
                  {scam?.videos?.map((v) => (
                    // <div
                    //   className="uploadedimage"
                    //   style={{ width: "100%", height: "100%" }}
                    //   key={v}
                    // >
                    <video controls
                    >
                      <source
                        src={v}
                        type="video/mp4"
                      />
                      Your browser does not support HTML video.
                    </video>
                    // </div>
                  ))}
                </Slider>
              </TabPanel>
            </SwipeableViews>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="blue" onClick={() => setopen(false)}>
            Close{" "}
          </Button>{" "}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ScamReportPage;
