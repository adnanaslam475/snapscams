import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import Swal from "sweetalert2";
import axios from "axios";
// import ReactPaginate from 'react-paginate';
// import moment from "moment";
import {
    Card,
    Container,
    Row,
    Col,
} from "reactstrap";

import CardsHeader from "components/Headers/CardsHeader";
import { useAuthStore } from "store";

import { useHistory, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";

window.Buffer = window.Buffer || require("buffer").Buffer;


function ScamsListing() {
    const [{ user, }] = useAuthStore();
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [data, setdata] = useState([])
    const loc = useLocation();

    const headersConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token || ""}`,
        },
    };

    const f = async (page = 1, limit = 1000) => {
        setLoading(true)
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_BASEURL}/scams/get/latest?page=${page}&limit=${limit}&snapchat_username=${loc.state?.snapchat_username}`,
                headersConfig
            );
            setdata(data);
        } catch (error) {
            Swal.fire({
                title: error || "Something Went Wrong",
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#3699FF",
                showCloseButton: true,
            });
        } finally { setLoading(false) }
    };

    useEffect(() => {
        f()
    }, [loc]);

    if (user === ({} || null)) { history.push('/login') }

    return (
        <>
            <CardsHeader name="Scam Reports" parentName="Scam Reports" />
            <Container className="mt--6" fluid>
                <Card className="">

                    <Card className="scam-container m-3">
                        {/* <CircularProgress style={{ color: "white" }} size={20} /> */}
                        {data.map(scam => <Card key={scam._id} className="scam-card p-3"
                            onClick={() => history.push(`/admin/scam-report/${scam._id}`)}>
                            <Row>
                                <Col md='4' className="flex-column" xs='12' lg='4' sm='4' xl='4'>
                                    <b>{scam.snapchat_username}</b>
                                    <p>{scam.description}</p>
                                </Col>
                                <Col md='4' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs='12' lg='4' sm='4' xl='4'>
                                    <b className="clr-white">{scam.scamtype}</b>
                                </Col>
                                <Col md='4' className="flex-column" style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'end'
                                }} xs='12' lg='4' sm='4' xl='4'>
                                    {scam.date}
                                    <h2> {scam.time}</h2>
                                </Col>
                            </Row>
                        </Card>)}
                        {/* <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    pageRangeDisplayed={5}
                    pageCount={5}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                /> */}
                    </Card>
                </Card>
                {loading && <CircularProgress style={{ color: "#5e72e4" }} size={30} />}
            </Container>
        </>
    );
}

export default ScamsListing;
