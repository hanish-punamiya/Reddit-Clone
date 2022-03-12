import React from "react";
import axios from "axios";
import FormData from "form-data";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import profilePic from "../../../ProfilePic.jpg";
import { PencilSquare, X } from "react-bootstrap-icons";
import { serverURL, imageBucket } from "../../../utils/config";

const EditProfile = () => {
  const [profilePicture, setProfilePicture] = useState(profilePic);
  const [selectedFile, setSelectedFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [topics, setTopics] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const history = useHistory();
  let userId = "";
  let token = "";

  const addedTopic = (id) => {
    const onTopicChange = (e) => {
      let topicsList = [...topics];
      topicsList[id] = e.target.value;
      setTopics(topicsList);
    };

    const onTopicDelete = (e) => {
      let topicsList = [...topics];
      topicsList.splice(id, 1);
      setTopics(topicsList);
    };

    return (
      <Row key={id} className="d-flex justify-content-start">
        <Col sm={6}>
          <Form.Group controlId={`formGridTopic${id}`}>
            {/* <Form.Label>Topic 1</Form.Label> */}
            <Form.Control
              value={topics[id]}
              type="text"
              placeholder="Topic Name"
              onChange={onTopicChange}
            />
          </Form.Group>
        </Col>
        <Col sm={6} className="d-flex align-items-start">
          <Button
            variant="danger"
            size="sm"
            style={{ marginTop: 2 }}
            onClick={onTopicDelete}
          >
            <X className="align-self-center"></X>
          </Button>
        </Col>
      </Row>
    );
  };

  const onAddTopic = (id) => {
    let topicsList = [...topics];
    topicsList.push("");
    setTopics(topicsList);
  };

  const handleUploadClick = async (event) => {
    console.log();
    const file = event.target.files[0];
    const reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setProfilePicture(reader.result);
    };
    setSelectedFile(file);
  };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("currentPassword", oldPassword);
      formData.append("newPassword", password);
      formData.append("aboutMe", description);
      formData.append("gender", gender);
      formData.append("location", location);
      // for (const topic of topics) {
      //   formData.append("topicList", topic);
      // }
      formData.append("topicList", JSON.stringify(topics));

      console.log(topics);
      token = localStorage.getItem("token");

      console.log(token);

      const result = await axios({
        method: "put",
        url: `${serverURL}/api/user/me`, //ltd make dynamic
        headers: {
          Authorization: `${token}`,
          "content-type": `multipart/form-data; boundary=${formData._boundary}`,
        },
        data: formData,
      });
      console.log(result);
      setSeverity("success");
      setMessage("Saved Successfully!");
      handleClick();
      //   history.push("/myprofile");
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

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container style={{ marginTop: 30 }}>
      <Form>
        <Row className="justify-content-md-center">
          <Col className="text-center" sm={{ span: 3, offset: 2 }}>
            <Image
              width={192}
              height={192}
              alt="Generic placeholder"
              className="align-self-center"
              src={profilePicture}
              roundedCircle
            />
          </Col>
          <Col sm={2} className="align-self-end mr-3">
            <label for="file-input">
              <PencilSquare style={{ fontSize: "30" }}></PencilSquare>
            </label>
            <input
              id="file-input"
              style={{ visibility: "hidden" }}
              accept="image/*"
              type="file"
              onChange={handleUploadClick}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center" style={{ marginTop: 10 }}>
          <Col className="" sm>
            <Form.Group controlId="formGridFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col className="" sm>
            <Form.Group controlId="formGridLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="" sm>
            <Form.Group controlId="formGridDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Describe yourself"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col className="" sm>
            <Form.Group controlId="formGridOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                minLength="6"
              />
              <small id="passwordHelpBlock" class="form-text text-muted">
                Please enter old password to set a new one
              </small>
            </Form.Group>
          </Col>
          <Col className="" sm>
            <Form.Group controlId="formGridPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
              />
              <small id="passwordHelpBlock" class="form-text text-muted">
                Password must be atleast 6 characters long
              </small>
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="" sm={6}>
            <Form.Group controlId="formGridGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="It's fluid"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="" sm={6}>
            <Form.Group controlId="formGridLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row className="d-flex justify-content-start">
          <Col sm={6}>
            <Form.Group controlId="formGridTopics">
              <Form.Label className="font-weight-bold">Topics</Form.Label>
            </Form.Group>
          </Col>
        </Row>
        {topics.length > 0 ? (
          topics.map((topic, index) => addedTopic(index))
        ) : (
          <p class="font-italic">No topics added yet</p>
        )}
        {}
        <Row className="d-flex justify-content-start">
          <Col sm={2}>
            <Button variant="primary" size="sm" onClick={onAddTopic}>
              Add Topic
            </Button>
          </Col>
        </Row>
        <Row
          className="d-flex justify-content-end"
          style={{ marginTop: 30, marginBottom: 30 }}
        >
          <Col sm={2}>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={onSubmit}
            >
              Save
            </Button>
          </Col>
          <Col sm={2}>
            <Link to="/myprofile">
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
          </Col>
        </Row>
      </Form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfile;
