import React from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Row, Col, Image, Button, Carousel, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { imageBucket } from "../../utils/config";

const Community = ({ community, onDelete, editCommunity }) => {
  const [open, setOpen] = React.useState(false);

  const onConfirmDelete = () => {
    setOpen(false);

    onDelete(community.id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Row style={{ padding: 10 }}>
        <Col sm={7}>
          <Row>
            <Col>
              <Typography variant="h3">{community.communityName}</Typography>
            </Col>
          </Row>
          <Row>
            <Col>
              <Typography variant="h5">{community.description}</Typography>
            </Col>
          </Row>
          <Row>
            <Col>
              <Typography variant="h6">Rules:</Typography>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup variant="flush">
                {community.rules.length > 0 ? (
                  community.rules.map((rule, index) => (
                    <ListGroup.Item key={index}>
                      <Typography variant="subtitle2">{rule.title}</Typography>
                      <Typography variant="body1">
                        {rule.description}
                      </Typography>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p class="font-italic">
                    There are no rules in this community
                  </p>
                )}
              </ListGroup>
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col>
              <Typography variant="subtitle1">No of Users:</Typography>
            </Col>
            <Col>
              <Typography variant="body1">
                {community.subscribersCount}
              </Typography>
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col>
              <Typography variant="subtitle1">No of Posts:</Typography>
            </Col>
            <Col>
              <Typography variant="body1">{community.postsCount}</Typography>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }} className="d-flex justify-content-end">
            <Col sm={2}>
              <Button
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  editCommunity(community);
                }}
                onFocus={(event) => event.stopPropagation()}
              >
                Edit
              </Button>
            </Col>
            <Col sm={2}>
              <Button
                variant="danger"
                onClick={handleClickOpen}
                style={{ marginLeft: 15 }}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Col>
        <Col
          sm={5}
          className="d-flex align-items-center justify-content-center"
        >
          {community.images.length > 0 ? (
            <Carousel>
              {community.images.map((image) => (
                <Carousel.Item>
                  <Image
                    className="d-block w-100"
                    style={{ height: 400 }}
                    src={`${imageBucket}${image}`}
                    rounded
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Typography className="font-italic" variant="caption">
              No images to show for this community
            </Typography>
          )}
        </Col>
      </Row>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this community?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this community will delete all the data related to the
            community
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirmDelete} variant="danger" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Community;
