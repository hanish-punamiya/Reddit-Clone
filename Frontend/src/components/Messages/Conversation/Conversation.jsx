import React from "react";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Toolbar, Typography, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useStyles } from "./style";
import Message from "./Message/Message";
import { serverURL, imageBucket } from "../../../utils/config";

const Conversation = ({ conversation, onSend }) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const onSendMessage = () => {
    setSeverity("");
    setMessage("");
    if (text === "") {
      setSeverity("warning");
      setMessage("Cannot Send an empty message!");
      handleClick();
      return;
    }
    setText("");
    onSend(conversation.id, text, conversation.name);
  };

  const messagePosition = (id) => {
    let pos = "";
    id === localStorage.getItem("id")
      ? (pos = "d-flex justify-content-end")
      : (pos = "");
    return "d-flex justify-content-end";
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="text-center" sm={12}>
          <Toolbar position="fixed" className={classes.toolBar}>
            <Typography variant="h6" noWrap>
              {conversation.name}
            </Typography>
          </Toolbar>
        </Col>
      </Row>
      <Row
        className="bg-light justify-content-md-center overflow-auto"
        sm={1}
        style={{ height: "70vh", marginTop: 20 }}
      >
        {conversation.messages.map((message) => (
          <Row>
            {message.from.id === localStorage.getItem("id") ? (
              <Col className="d-flex justify-content-end">
                <Message key={message.id} message={message}></Message>
              </Col>
            ) : (
              <Col className>
                <Message key={message.id} message={message}></Message>
              </Col>
            )}
          </Row>
        ))}
      </Row>
      <Row className="justify-content-md-center" style={{ marginTop: 20 }}>
        <Col className="text-center" sm={12}>
          <InputGroup className="mb-3" size="lg">
            <FormControl
              required
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="Message"
              aria-label="Message"
              aria-describedby="Message-send"
            />
            <InputGroup.Append>
              <Button variant="primary" size="lg" onClick={onSendMessage}>
                Send
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Conversation;
