import React from "react";
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap/";
import { serverURL } from "../../utils/config";
import { Typography } from "@material-ui/core";

const Charts = ({ data, title, subtitle, value, argument }) => {
  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }
  const [key, setkey] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    setkey((prevKey) => !prevKey);
  }, [size.width]);
  return (
    <Chart
      key={key}
      height="500px"
      width="100%"
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        hAxis: {
          title: data[0][0],
        },
        vAxis: {
          title: data[0][1],
          minValue: 0,
        },
        chart: {
          title,
          subtitle,
        },
        axes: {
          x: {
            0: { label: data[0][0] }, // Bottom x-axis.
          },
          y: {
            0: { label: data[0][1] },
          },
        },
      }}
    />
  );
};

const CommunityAnalytics = () => {
  const [maxUsers, setMaxUsers] = useState(["Community Name", "No of Users"]);
  const [maxPosts, setMaxPosts] = useState(["Community Name", "No of Posts"]);
  const [userMaxPost, setUserMaxPost] = useState(["User Name", "No of Posts"]);
  const [upvotedPosts, setUpvotedPosts] = useState([
    "Post Id, Community Name",
    "No of Upvotes",
  ]);
  // const [analyticData, setAnalyticData] = useState({});

  const [mainMessage, setMainMessage] = useState("");

  // const data = {
  //   MaxUserCount: [
  //     {
  //       communityName: "Community 1",
  //       userCount: 13,
  //     },
  //     {
  //       communityName: "Community 2",
  //       userCount: 2,
  //     },
  //     {
  //       communityName: "Community 3",
  //       userCount: 1,
  //     },
  //     {
  //       communityName: "Community 5",
  //       userCount: 1,
  //     },
  //     {
  //       communityName: "Biology",
  //       userCount: 0,
  //     },
  //     {
  //       communityName: "Big Data",
  //       userCount: 0,
  //     },
  //     {
  //       communityName: "Community 4",
  //       userCount: 0,
  //     },
  //   ],
  //   MaxPostCount: [
  //     {
  //       communityName: "Biology",
  //       postCount: 5,
  //     },
  //     {
  //       communityName: "Big Data",
  //       postCount: 3,
  //     },
  //     {
  //       communityName: "Community 1",
  //       postCount: 0,
  //     },
  //     {
  //       communityName: "Community 2",
  //       postCount: 0,
  //     },
  //     {
  //       communityName: "Community 3",
  //       postCount: 0,
  //     },
  //     {
  //       communityName: "Community 4",
  //       postCount: 0,
  //     },
  //     {
  //       communityName: "Community 5",
  //       postCount: 0,
  //     },
  //   ],
  //   UpvotedPost: [
  //     {
  //       communityName: "Big Data",
  //       postInfo: {
  //         postId: 30,
  //         title: "Data",
  //         upvotes: 2,
  //         postedBy: "kelly",
  //         date: "2021-05-07T12:22:24.000Z",
  //         type: "Text",
  //         content: null,
  //       },
  //     },
  //     {
  //       communityName: "Biology",
  //       postInfo: {
  //         postId: 31,
  //         title: "Data",
  //         upvotes: 1,
  //         postedBy: "kelly",
  //         date: "2021-05-07T12:25:13.000Z",
  //         type: "Link",
  //         content: null,
  //       },
  //     },
  //     {
  //       communityName: "Biology",
  //       postInfo: {
  //         postId: 37,
  //         title: "App Dev",
  //         upvotes: 1,
  //         postedBy: "kelly",
  //         date: "2021-05-08T02:59:43.000Z",
  //         type: "text",
  //         content: null,
  //       },
  //     },
  //     {
  //       communityName: "Biology",
  //       postInfo: {
  //         postId: 32,
  //         upvotes: 0,
  //       },
  //     },
  //     {
  //       communityName: "Biology",
  //       postInfo: {
  //         postId: 33,
  //         upvotes: 0,
  //       },
  //     },
  //     {
  //       communityName: "Biology",
  //       postInfo: {
  //         postId: 34,
  //         upvotes: 0,
  //       },
  //     },
  //     {
  //       communityName: "Big Data",
  //       postInfo: {
  //         postId: 35,
  //         upvotes: 0,
  //       },
  //     },
  //     {
  //       communityName: "Big Data",
  //       postInfo: {
  //         postId: 36,
  //         upvotes: 0,
  //       },
  //     },
  //     null,
  //     null,
  //   ],
  //   UserMaxPost: [
  //     {
  //       user: "kelly",
  //       postCount: 5,
  //     },
  //     {
  //       user: "Danish",
  //       postCount: 3,
  //     },
  //   ],
  // };

  const addDataToState = (name, data) => {
    let temparray1 = [];
    switch (name) {
      case "MaxUserCount":
        // temparray1.push("Community Name","No of Users")
        data[name].map((community) => {
          let temparray2 = [];
          temparray2.push(community.communityName);
          temparray2.push(community.userCount);
          temparray1.push(temparray2);
        });
        setMaxUsers([maxUsers, ...temparray1]);
        console.log(temparray1);
        temparray1 = [];
        break;
      case "MaxPostCount":
        // temparray1.push("Community Name","No of Users")
        data[name].map((community) => {
          let temparray2 = [];
          temparray2.push(community.communityName);
          temparray2.push(community.postCount);
          temparray1.push(temparray2);
        });
        setMaxPosts([maxPosts, ...temparray1]);
        console.log(temparray1);
        temparray1 = [];
        break;
      case "UpvotedPost":
        // temparray1.push("Community Name","No of Users")
        data[name].map((community) => {
          if (community) {
            let temparray2 = [];
            temparray2.push(
              `${community.postInfo["postId"]}, ${community.communityName}`
            );
            temparray2.push(community.postInfo.upvotes);
            temparray1.push(temparray2);
          }
        });
        setUpvotedPosts([upvotedPosts, ...temparray1]);
        console.log(temparray1);
        temparray1 = [];
        break;
      case "UserMaxPost":
        // temparray1.push("Community Name","No of Users")
        data[name].map((community) => {
          let temparray2 = [];
          temparray2.push(community.user);
          temparray2.push(community.postCount);
          temparray1.push(temparray2);
        });
        setUserMaxPost([userMaxPost, ...temparray1]);
        console.log(temparray1);
        temparray1 = [];
        break;

      default:
        break;
    }
  };

  const setData = (data) => {
    if (Object.keys(data).length > 0) {
      for (let analysis in data) {
        if (analysis) {
          addDataToState(analysis, data);
        }
      }
    } else {
      setMainMessage("You do not own any communities");
    }
  };

  const getAnalyticData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios({
        method: "get",
        url: `${serverURL}/api/community-analytics`,
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(result);
      if (result.data === "You do not own a community") {
        setMainMessage((value) => "You do not own a community");
      } else if (result.data) {
        // console.log(result.data);
        // setAnalyticData((value) => result.data);
        setData(result.data);
      }
      console.log(result.data);
    } catch (error) {
      console.log(error);
      const { errors } = error.response.data;
      if (errors) {
        errors.forEach((error) => {
          console.log(error.msg);
        });
      }
    }
  };

  useEffect(() => {
    getAnalyticData();
  }, []);

  const showMaxUsers = () => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col>
          <Charts
            style={{ marginBottom: 10 }}
            title={"Most Users"}
            subtitle={"Top 10 communities with the maximum number of users"}
            data={maxUsers}
          ></Charts>
        </Col>
      </Row>
    );
  };
  const showMaxPosts = () => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col>
          <Charts
            title={"Most Posts"}
            subtitle={"Top 10 communities with the maximum number of Posts"}
            data={maxPosts}
          ></Charts>
        </Col>
      </Row>
    );
  };
  const showUpvotedPosts = () => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col>
          <Charts
            title={"Most Upvoted Posts"}
            subtitle={"Top 10 posts with the most number of upvotes"}
            data={upvotedPosts}
          ></Charts>
        </Col>
      </Row>
    );
  };
  const showUserMaxPost = () => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col>
          <Charts
            title={"Most Posts by a User"}
            subtitle={"Top 10 users with the maximum number of posts"}
            data={userMaxPost}
          ></Charts>
        </Col>
      </Row>
    );
  };

  const showGraphs = () => {
    return (
      <Row>
        <Col>
          {maxUsers.length > 1
            ? showMaxUsers()
            : showError(
                "No Graph to show for maximum number of users in communities"
              )}
          <hr />
          {maxPosts.length > 1
            ? showMaxPosts()
            : showError(
                "No Graph to show for maximum number of posts in communities"
              )}
          <hr />
          {upvotedPosts.length > 1
            ? showUpvotedPosts()
            : showError(
                "No Graph to show for most upvoted posts in communities"
              )}
          <hr />
          {userMaxPost.length > 1
            ? showUserMaxPost()
            : showError(
                "No Graph to show for users with the most number of posts in communities"
              )}
        </Col>
      </Row>
    );
  };

  const showError = (message) => {
    return (
      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center">
          <Typography variant="h6">{message}</Typography>
        </Col>
      </Row>
    );
  };

  return (
    <Container style={{ padding: 10 }}>
      {mainMessage.length > 0
        ? showError("No Graph to show for this user")
        : showGraphs()}
    </Container>
  );
};

export default CommunityAnalytics;
