import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Typography, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  ListGroup,
  Form,
} from "react-bootstrap";
import profilePic from "../../../ProfilePic.jpg";
import { serverURL, imageBucket } from "../../../utils/config";
// import { Link, useHistory } from "react-router-dom";
// import SearchAppBar from "../../Messages/Search/SearchBar";

const UserProfile = ({ userProfileId }) => {
  const [profilePicture, setProfilePicture] = useState(profilePic);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [communities, setCommunities] = useState([]);
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();
  const historyLocation = useLocation();

  let userId = "";
  let token = "";

  const fetchUserData = async (userProfileId) => {
    try {
      const result = await axios({
        method: "get",
        url: `${serverURL}/api/user/${userProfileId}`, //ltd make dynamic
      });
      if (result.data) {
        const user = result.data;
        if (user.profilePicture) {
          setProfilePicture(`${imageBucket}${user.profilePicture}`);
        } else {
          setProfilePicture(profilePic);
        }
        if (user.firstName) {
          setFirstName(user.firstName);
        } else {
          setFirstName("");
        }
        if (user.lastName) {
          setLastName(user.lastName);
        } else {
          setLastName("");
        }
        if (user.aboutMe) {
          setDescription(user.aboutMe);
        } else {
          setDescription("");
        }
        if (user.gender) {
          setGender(user.gender);
        } else {
          setGender("");
        }
        if (user.location) {
          setLocation(user.location);
        } else {
          setLocation("");
        }
        if (user.communities) {
          setCommunities(user.communities);
        } else {
          setCommunities([]);
        }
        if (user.topicList) {
          setTopics(user.topicList);
        } else {
          setTopics([]);
        }
      } else console.log("did not recieve user data from backend");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userProfileId === localStorage.getItem("id")) {
      //   history.push("/myprofile");
    }
    historyLocation.state.userProfileId
      ? fetchUserData(historyLocation.state.userProfileId)
      : fetchUserData(userProfileId);
    // setDescription("Lorem ipsum dolor sit amet consectetur adipisicing elit.");
    // setGender("Male");
    // setLocation("San Jose, CA");
    // setCommunities(() => ["Football", "BasketBall", "News"]);
  }, [historyLocation]);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClick = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
    setSeverity("");
  };

  const initSnackBar = (severity, error) => {
    setSeverity(severity);
    setErrorMessage(error);
    handleClick();
    return;
  };

  const onSendMessage = async (e) => {
    e.preventDefault();
    token = localStorage.getItem("token");
    if (message === "") {
      initSnackBar("warning", "You cannot send an empty message!");
    } else {
      try {
        const result = await axios({
          method: "post",
          url: `${serverURL}/api/message/`, //ltd make dynamic
          headers: {
            Authorization: `${token}`,
          }, //ltd set value of token here
          data: {
            toUserId: historyLocation.state.userProfileId,
            text: message,
          },
        });
        console.log(result);
        if (result.data) {
          setMessage("");
          initSnackBar("success", "Message sent successfully!");
        } else initSnackBar("error", "Some error occured");
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          initSnackBar("error", error.response.data);
        } else if (error.request) {
          console.log(error.request);
          initSnackBar("error", "Some error occured in request");
        } else {
          console.log("Error", error.message);
          initSnackBar("error", error.message);
        }
        console.log(error.config);
      }
    }
  };

  return (
    <Container style={{ marginTop: 30 }}>
      <Row className="justify-content-md-center">
        <Col className="text-center" sm={3}>
          <Image
            width={192}
            height={192}
            alt="Generic placeholder"
            className="align-self-center"
            src={profilePicture}
            roundedCircle
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{ marginTop: 30 }}>
        <Col
          className="d-flex justify-content-center"
          sm={{ span: 5, offset: 2 }}
        >
          <Typography variant="h4">{`${firstName} ${lastName}`}</Typography>
        </Col>
        <Col className="d-flex justify-content-start align-items-end" sm={2}>
          <Typography variant="h6">{`${gender}`}</Typography>
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{ marginTop: 10 }}>
        <Col className="d-flex justify-content-center align-items-center">
          <Typography
            class="font-italic"
            variant="subtitle1"
          >{`${location}`}</Typography>
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{ marginTop: 20 }}>
        <Col
          Col
          sm={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Typography variant="subtitle1">{`${description}`}</Typography>
        </Col>
      </Row>
      <hr />
      <Row className="d-flex justify-content-start">
        <Col sm={6}>
          <Typography variant="h6">{`Communities`}</Typography>
        </Col>
        <Col sm={6}>
          <Typography variant="h6">{`Topics`}</Typography>
        </Col>
      </Row>
      <Row className="d-flex justify-content-start" style={{ marginTop: 10 }}>
        <Col sm={6}>
          <ListGroup variant="flush">
            {communities.length > 0 ? (
              communities.map((community, index) => (
                <ListGroup.Item key={index}>
                  {community.communityName}
                </ListGroup.Item>
              ))
            ) : (
              <p class="font-italic">No communities joined as of yet yet</p>
            )}
          </ListGroup>
        </Col>
        <Col sm={6}>
          <ListGroup variant="flush">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <ListGroup.Item key={index}>{topic}</ListGroup.Item>
              ))
            ) : (
              <p class="font-italic">No topics of interest as of yet</p>
            )}
          </ListGroup>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center" style={{ marginTop: 30 }}>
        <Col className="text-center" sm={6}>
          <Form>
            <Row className="d-flex justify-content-center">
              <Col sm={10}>
                <Form.Group controlId="form.message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={3}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say hi!"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex justify-content-end">
              <Col sm={3} style={{ marginRight: 20, marginBottom: 20 }}>
                <Button
                  variant="primary"
                  type="submit"
                  size="md"
                  onClick={onSendMessage}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

UserProfile.defaultProps = {
  userProfileId: localStorage.getItem("id"),
};

export default UserProfile;
