import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import RecommendIcon from "@mui/icons-material/Recommend";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { Card, Container, Row } from "reactstrap";
import { useTable } from "react-table";
import { useAuthStore } from "store";

import { useHistory } from "react-router-dom";
import "./adnan.css";
import { CircularProgress } from "@mui/material";

function ScammerTable({ }) {
  const history = useHistory();
  const [votes, setVotes] = useState([]);
  const [loading, setloading] = useState(true);
  const [{ scammerId, user }, dispatch] = useAuthStore();
  const headersConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    },
  };
  const [data, setdata] = useState([]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      autoResetHiddenColumns: false,
      columns: [
        {
          Header: "NAME",
          accessor: "name",
          id: "name",
          Cell: (props) => {
            return <div> {props.value} </div>;
          },
        },
        {
          Header: "USERNAME",
          id: "snapchat_username",
          accessor: "snapchat_username",
          Cell: (props) => <div> @{props.value} </div>,
        },
        {
          Header: "RATING",
          accessor: "rating",
          id: "reportedBy",
        },
        {
          Header: "NUMBER OF VOTES",
          id: "scamtype",
          accessor: "votes",
          Cell: ({ row, value }) => {
            return (
              <>
                {" "}
                {value}{" "}
                {votes.every(
                  (v) => v.vote == "d" && v.scamId == row.original?.id
                ) ? (
                  <ThumbDownAltIcon fontSize="small" />
                ) : (
                  <RecommendIcon color="" className="ml-1" fontSize="small" />
                )}
              </>
            );
          },
        },
        {
          Header: "NUMBER OF COMMENTS",
          accessor: "comments",
          id: "comments",
          Cell: (props) => {
            return (
              <>
                {" "}
                {props.value}{" "}
                <CommentIcon color="" className="ml-1" fontSize="small" />
              </>
            );
          },
        },
      ],
      data,
    });

  const f = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/scam/search?search=${scammerId}`,
        headersConfig
      );
      setVotes(data?.votes);
      setdata(
        data?.data.map((v) => {
          const a =
            (data?.votes.filter(
              (val) => val.scamId === v._id.toString() && val.vote === "u"
            ).length /
              data?.votes.filter((val) => val.scamId === v._id.toString())
                .length) *
            100;
          return {
            id: v._id,
            comments: `${data?.comments.filter((val) => val === v._id.toString()).length ||
              0
              } comments`,
            snapchat_username: v.snapchat_username,
            name: v.name,
            reportedBy: v.reportedBy,
            scamtype: v.scamtype,
            rating: (isNaN(a) ? 0 : a) + "%",
            votes: `${data?.votes.filter((val) => val.scamId === v._id.toString())
              .length || 0
              } votes`,
          };
        })
      );
    } catch (error) {
      Swal.fire({
        title: error || "Something Went Wrong",
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#3699FF",
        showCloseButton: true,
      });
    }
    finally {
      setloading(false)
    }
  };

  useEffect(() => {
    // if (!!scammerId)
    f();
  }, [scammerId]);

  return (
    <Container fluid>
      <Card className="br-10 p-4">
        <Row className="mt-2 " style={{
        }}>

          {loading ? <CircularProgress className="circle" /> : <table className="tbl" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps({
                        style: {
                          cursor: "pointer",
                          width: "200px",
                          minHeight: "200px",
                        },
                      })}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    className="react-table-row"
                    key={row.original?.id}
                    {...row.getRowProps({
                      onClick: () => {
                        history.push(`/admin/scams/${row.original?.id}`, {
                          snapchat_username: row.original?.snapchat_username,
                        });
                      },
                    })}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td className="react-table-td" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>}
        </Row>
      </Card>
    </Container>
  );
}

export default ScammerTable;
