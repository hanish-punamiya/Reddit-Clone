import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Typography, Snackbar } from "@material-ui/core";
import profilePicture from "../../../ProfilePic.jpg";
import MuiAlert from "@material-ui/lab/Alert";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  FormControl,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { serverURL, imageBucket } from "../../../utils/config";

export default function SearchAppBar() {
  const [name, setName] = useState("");
  const [userList, setUserList] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleSearch = async () => {
    if (name === "") {
      setSeverity("warning");
      setMessage("Please enter the name of a user!");
      handleClick();
      return;
    } else {
      try {
        const token = localStorage.getItem("token");
        const result = await axios({
          method: "post",
          url: `${serverURL}/api/message/find`,
          headers: {
            Authorization: `${token}`,
          },
          data: { userName: name },
        });
        console.log(result);
        setUserList((value) => result.data);
      } catch (error) {
        console.log(error);
      }
      setModalShow(true);
      setName("");
    }
  };

  const handleSearchClose = () => {
    setUserList([]);
    // setName("");
    setModalShow(false);
  };

  return (
    <div style={{ width: 200 }}>
      <UserSearchDisplay
        show={modalShow}
        data={userList}
        handleSearchClose={handleSearchClose}
        onHide={() => setModalShow(false)}
      />
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Name"
          aria-label="userName"
          aria-describedby="userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputGroup.Append>
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export function UserSearchDisplay(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="user-search-display" centered>
      <Modal.Header closeButton>
        <Modal.Title id="user-search-display">Users from Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {props.data.length > 0 ? (
            props.data.map((user, index) => (
              <Row style={{ marginTop: 10 }}>
                <Col sm={1}>
                  <Image
                    style={{ height: 48, width: 48 }}
                    src={
                      user.profilePicture
                        ? `${imageBucket}${user.profilePicture}`
                        : profilePicture
                    }
                    roundedCircle
                  />
                </Col>
                <Col sm={8}>
                  <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
                  <Typography class="font-italic">{user.email}</Typography>
                </Col>

                <Col sm={3} class="d-flex align-items-center">
                  <Link
                    to={{
                      pathname: "/userprofile",
                      state: { userProfileId: user.id },
                    }}
                  >
                    <Button onClick={props.handleSearchClose}>
                      View Profile
                    </Button>
                  </Link>
                </Col>
              </Row>
            ))
          ) : (
            <p class="font-italic">No Users found!</p>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

UserSearchDisplay.defaultProps = {
  data: [],
};
