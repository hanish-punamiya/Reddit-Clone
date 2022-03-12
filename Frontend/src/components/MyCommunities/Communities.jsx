import React from "react";
import { Typography, TablePagination } from "@material-ui/core";
import { Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import axios from "axios";
// import CommunityAccordian from "./CommunityAccordian";
import Community from "./Community";
import { serverURL } from "../../utils/config";

const Communities = ({ goBack, editCommunity }) => {
  const [communities, setCommunities] = useState([]);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [shownItems, setShownItems] = useState(2);
  const [order, setOrder] = useState(0);
  const [sortBy, setSortBy] = useState(0);

  const orderOptions = ["Ascending", "Descending"];
  const sortByDisplayOptions = ["Created date", "No of posts", "No of users"];
  const sortByOptions = ["createdDate", "postsCount", "subscribersCount"];

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setShownItems((newPage + 1) * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage((prev) => {
      return event.target.value;
    });
    console.log(rowsPerPage);
    setPage(0);
    setShownItems(event.target.value);
  };

  const onOrderSelect = (eventKey, event) => {
    console.log(orderOptions[eventKey]);
    setOrder(eventKey);
    let toSortArray = communities;
    toSortArray.sort(
      compareValues(sortByOptions[sortBy], orderOptions[eventKey])
    );
    console.log(toSortArray);
    setCommunities(toSortArray);
  };

  const onSortBySelect = (eventKey, event) => {
    console.log(sortByDisplayOptions[eventKey]);
    setSortBy(eventKey);
    let toSortArray = communities;
    toSortArray.sort(
      compareValues(sortByOptions[eventKey], orderOptions[order])
    );
    console.log(toSortArray);
    setCommunities(toSortArray);
  };

  const compareValues = (key, order = "Ascending") => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "Descending" ? comparison * -1 : comparison;
    };
  };

  const getCommunities = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios({
        method: "get",
        url: `${serverURL}/api/mycommunity`,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (result.data.length > 0) {
        setCommunities((value) => result.data);
      }
      console.log(result.data);
    } catch (error) {
      const { errors } = error.response.data;
      if (errors) {
        errors.forEach((error) => {
          setSeverity("error");
          setMessage(error.msg);
        });
      }
    }
  };

  const removeCommunityFromList = (id) => {
    let tempCommunities = [...communities];
    const deletId = tempCommunities.find((community, index) => {
      if (community.id === id) return index;
    });
    console.log(deletId);
    tempCommunities.splice(tempCommunities.indexOf(deletId), 1);
    setCommunities(tempCommunities);
    console.log(id);
    return;
  };

  const onCommunityDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const params = {
        community_id: id,
      };
      const result = await axios({
        method: "delete",
        url: `${serverURL}/api/mycommunity/${id}`, //ltd make dynamic
        headers: {
          Authorization: `${token}`,
        },
        params,
      });
      console.log(result.data);
      if (result.data) {
        removeCommunityFromList(id);
        setSeverity("success");
        setMessage("Community deleted successfully!");
        handleClick();
      }
    } catch (error) {
      const { errors } = error.response.data;
      if (errors) {
        errors.forEach((error) => {
          setSeverity("error");
          setMessage(error.msg);
        });
      }
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
      handleClick();
    }
  };

  useEffect(() => {
    getCommunities();
  }, []);

  return (
    // <Container fluid>
    //   <Row className="d-flex justify-content-center">
    //     <Col sm={{ span: 5, offset: 2 }}>
    //       <Row>
    //         <Col>
    //           {communities.map((community, index) => (
    //             <CommunityAccordian
    //               key={index}
    //               community={community}
    //               onDelete={onCommunityDelete}
    //               editCommunity={editCommunity}
    //               //   goBack={goBack}
    //             ></CommunityAccordian>
    //           ))}
    //         </Col>
    //       </Row>
    //     </Col>
    //     <Col style={{ marginLeft: 20 }} sm={{ span: 3 }}>
    //       <Row>
    //         <Col>Placeholder</Col>
    //       </Row>
    //     </Col>
    //   </Row>
    // </Container>
    <Container fluid>
      <Col>
        <Row>
          <Container
            fluid
            style={{ borderBottom: "1px solid", marginBottom: 10 }}
          >
            <Row className="d-flex justify-content-around">
              <Col sm={3}>
                <Row className="d-flex justify-content-center align-items-center">
                  <Col className="d-flex justify-content-end align-items-center">
                    <Typography variant="h6">Order:</Typography>
                  </Col>
                  <Col className="d-flex justify-content-start align-items-center ">
                    <DropdownButton
                      id="dropdown-order-button"
                      variant="secondary"
                      title={orderOptions[order]}
                    >
                      <Dropdown.Item eventKey={0} onSelect={onOrderSelect}>
                        Ascending
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={1} onSelect={onOrderSelect}>
                        Descending
                      </Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
              </Col>
              <Col sm={4}>
                <Row className="d-flex justify-content-center align-items-center">
                  <Col className="d-flex justify-content-end align-items-center">
                    <Typography variant="h6">Sort By:</Typography>
                  </Col>
                  <Col className="d-flex justify-content-start align-items-center">
                    <DropdownButton
                      id="dropdown-order-button"
                      variant="secondary"
                      title={sortByDisplayOptions[sortBy]}
                    >
                      <Dropdown.Item eventKey={0} onSelect={onSortBySelect}>
                        Created Date
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={1} onSelect={onSortBySelect}>
                        No of Posts
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={2} onSelect={onSortBySelect}>
                        no of Users
                      </Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
              </Col>
              <Col sm={5}>
                <TablePagination
                  component="div"
                  count={communities.length}
                  page={page}
                  onChangePage={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[2, 5, 10]}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Col>
            </Row>
          </Container>
        </Row>
        {communities.length > 0 ? (
          <Row className="d-flex justify-content-center">
            <Col>
              {communities.map(
                (community, index) =>
                  index < shownItems &&
                  index >= shownItems - rowsPerPage && (
                    <Row style={{ marginBottom: 20 }}>
                      <Col>
                        <Community
                          key={index}
                          community={community}
                          onDelete={onCommunityDelete}
                          editCommunity={editCommunity}
                          //   goBack={goBack}
                        ></Community>
                        <hr />
                      </Col>
                    </Row>
                  )
              )}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <Typography>This user does not own any communities</Typography>
            </Col>
          </Row>
        )}
      </Col>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Communities;
