import React from "react";
import axios from "axios";
import FormData from "form-data";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Container, Row, Col, Button, Form, Figure } from "react-bootstrap";
import EmptyImage from "../../EmptyImage.png";
import { serverURL } from "../../utils/config";
import { CloudArrowUp, X } from "react-bootstrap-icons";

const CreateCommunity = ({ goBack }) => {
  const [image, setImage] = useState(EmptyImage);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState([]);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const history = useHistory();
  let userId = "";
  let token = "";
  let imgs = [];

  const addedRule = (id) => {
    const onRuleTitleChange = (e) => {
      let rulesList = [...rules];
      rulesList[id].title = e.target.value;
      setRules(rulesList);
    };

    const onRuleDescriptionChange = (e) => {
      let rulesList = [...rules];
      rulesList[id].description = e.target.value;
      setRules(rulesList);
    };

    const onRulesDelete = (e) => {
      let rulesList = [...rules];
      rulesList.splice(id, 1);
      setRules(rulesList);
    };

    return (
      <Row key={id} className="d-flex justify-content-start">
        <Col sm={5}>
          <Form.Group controlId={`formGridRulesTitle${id}`}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={rules[id].title}
              type="text"
              placeholder="Rule Title"
              onChange={onRuleTitleChange}
            />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId={`formGridRulesDescription${id}`}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={rules[id].description}
              type="text"
              placeholder="Rule Description"
              onChange={onRuleDescriptionChange}
            />
          </Form.Group>
        </Col>
        <Col sm={1} className="d-flex align-items-center">
          <Button
            variant="danger"
            size="sm"
            style={{ marginTop: 2 }}
            onClick={onRulesDelete}
          >
            <X className="align-self-center"></X>
          </Button>
        </Col>
      </Row>
    );
  };

  const onAddRule = (id) => {
    let rulesList = [...rules];
    rulesList.push({ title: "", description: "" });
    setRules(rulesList);
  };

  const handleUploadClick = async (event) => {
    console.log(event.target.files);
    setImagesUpload([...event.target.files]);
    setSeverity("success");
    setMessage("Images saved successfully!");
    handleClick();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validation = () => {
      if (communityName === "") setMessage("Community name cannot be empty!");
      else if (description === "") setMessage("Description cannot be empty!");
      else if (rules.length === 0) setMessage("Add atleast one rule!");
      else if (
        rules.find((rule) => rule.title === "" || rule.description === "")
      )
        setMessage("Rule fields cannot be empty!");
      else return true;
      setSeverity("warning");
      handleClick();
      return false;
    };

    try {
      if (validation()) {
        token = localStorage.getItem("token");
        const formData = new FormData();
        console.log(imagesUpload);
        for (const key of Object.keys(imagesUpload)) {
          formData.append("communityImages", imagesUpload[key]);
        }
        formData.append("communityName", communityName);
        console.log(formData.communityImages);
        formData.append("description", description);
        formData.append("rules", JSON.stringify(rules));

        const result = await axios({
          method: "post",
          url: `${serverURL}/api/mycommunity/create`,
          headers: {
            Authorization: `${token}`,
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
          data: formData,
        });
        console.log(result.data);
        if (result.data) {
          imgs = [];
          setSeverity("success");
          setMessage("Community created successfully!");
          handleClick();
          goBack();
        }
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

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Container style={{ marginTop: 30 }}>
      <Form>
        <Row className="justify-content-md-center">
          <Col className="text-center" sm={{ span: 4, offset: 2 }}>
            <Figure>
              <Figure.Image
                width={400}
                height={300}
                alt="171x180"
                src={image}
              />
              <Figure.Caption>
                Please upload the images for the community
              </Figure.Caption>
            </Figure>
          </Col>
          <Col sm={2} className="align-self-end mr-3">
            <label for="file-input">
              <CloudArrowUp style={{ fontSize: "30" }}></CloudArrowUp>
            </label>
            <input
              id="file-input"
              style={{ visibility: "hidden" }}
              accept="image/*"
              type="file"
              multiple
              onChange={handleUploadClick}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center" style={{ marginTop: 10 }}>
          <Col className="" sm>
            <Form.Group controlId="formGridCommunityName">
              <Form.Label>Community Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Community Name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="" sm>
            <Form.Group controlId="formGridCommunityDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Community Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <Row className="d-flex justify-content-start">
          <Col sm={6}>
            <Form.Group controlId="formGridRules">
              <Form.Label className="font-weight-bold">Rules</Form.Label>
            </Form.Group>
          </Col>
        </Row>
        {rules.length > 0 ? (
          rules.map((rule, index) => addedRule(index))
        ) : (
          <p class="font-italic">No rules added yet</p>
        )}

        <Row className="d-flex justify-content-start">
          <Col sm={2}>
            <Button variant="primary" size="sm" onClick={onAddRule}>
              Add Rule
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
            <Button variant="secondary" size="lg" onClick={goBack}>
              Cancel
            </Button>
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

export default CreateCommunity;
