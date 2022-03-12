import React from "react";
import axios from "axios";
import { Typography } from "@material-ui/core";
import { Container, Row, Col, Image, Button, ListGroup } from "react-bootstrap";
import profilePic from "../../../ProfilePic.jpg";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { serverURL, imageBucket } from "../../../utils/config";

const MyProfile = () => {
  const [profilePicture, setProfilePicture] = useState(profilePic);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [topics, setTopics] = useState([]);
  const [communities, setCommunities] = useState([]);

  let userId = "";
  let token = "";

  const fetchUserData = async () => {
    try {
      userId = localStorage.getItem("id");
      token = localStorage.getItem("token");
      const result = await axios({
        method: "get",
        url: `${serverURL}/api/user/${userId}`, //ltd make dynamic
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(result.data);
      if (result.data) {
        const user = result.data;
        if (user.profilePicture)
          setProfilePicture(imageBucket + user.profilePicture);
        if (user.firstName) setFirstName(user.firstName);
        if (user.lastName) setLastName(user.lastName);
        if (user.aboutMe) setDescription(user.aboutMe);
        if (user.gender) setGender(user.gender);
        if (user.location) setLocation(user.location);
        if (user.communities) setCommunities(user.communities);
        if (user.topicList) setTopics(user.topicList);
      } else console.log("did not recieve user data from backend");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        <Col className="d-flex justify-content-center align-items-center">
          <Typography variant="subtitle1">{`${description}`}</Typography>
        </Col>
      </Row>
      <hr />
      <Row className="d-flex justify-content-start">
        <Col sm={6}>
          <Typography variant="h6">{`Interests`}</Typography>
        </Col>
        <Col sm={6}>
          <Typography variant="h6">{`Communities`}</Typography>
        </Col>
      </Row>
      <Row className="d-flex justify-content-start" style={{ marginTop: 10 }}>
        <Col sm={6}>
          <ListGroup variant="flush">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <ListGroup.Item key={index}>{topic}</ListGroup.Item>
              ))
            ) : (
              <p class="font-italic">No interests as of yet yet</p>
            )}
          </ListGroup>
        </Col>
        <Col sm={6}>
          <ListGroup variant="flush">
            {communities.length > 0 ? (
              communities.map((community, index) => (
                <ListGroup.Item key={index}>
                  {community.communityName}
                </ListGroup.Item>
              ))
            ) : (
              <p class="font-italic">No Communities joined as of yet</p>
            )}
          </ListGroup>
        </Col>
      </Row>
      <Row
        className="d-flex justify-content-end"
        style={{ marginTop: 30, marginBottom: 30 }}
      >
        <Col sm={2}>
          <Link to="/editprofile">
            <Button variant="primary" size="md">
              Edit
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
