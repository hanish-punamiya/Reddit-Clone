import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Carousel,
  Form,
  Dropdown,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const CommunityAccordian = ({ community, onDelete, editCommunity }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion
      style={{ marginBottom: 5 }}
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        className="d-flex justify-content-between"
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Col sm={9}>
          <Typography variant="h5">{community.communityName}</Typography>
        </Col>
        <Col sm={3} className="d-flex justify-content-around">
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
          {/* </Link> */}
          <Button
            variant="danger"
            onClick={(event) => {
              onDelete(community.id);
              event.stopPropagation();
            }}
            style={{ marginLeft: 15 }}
            // onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
          >
            Delete
          </Button>
        </Col>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          <Row>
            <Col>
              <Typography>{community.description}</Typography>
            </Col>
          </Row>
          {/* <Row style={{ marginTop: 20 }}>
            <Col>
              <Typography variant="subtitle2">Gallery:</Typography>
            </Col>
          </Row> */}
          <Row style={{ marginTop: 20 }}>
            <Col>
              {community.images.length > 0 ? (
                <Carousel>
                  {community.images.map((image) => (
                    <Carousel.Item>
                      <Image
                        className="d-block w-100"
                        style={{ height: 360 }}
                        src={image}
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

          <Row style={{ marginTop: 20 }}>
            <Col>
              <Typography variant="subtitle2">No of Users:</Typography>
            </Col>
            <Col>
              <Typography variant="body2">
                {community.subscribersCount}
              </Typography>
            </Col>
          </Row>
          <Row style={{ marginTop: 7 }}>
            <Col>
              <Typography variant="subtitle2">No of Posts:</Typography>
            </Col>
            <Col>
              <Typography variant="body2">{community.postsCount}</Typography>
            </Col>
          </Row>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default CommunityAccordian;
