import React from 'react';
import {
  Paper,
  List,
  Select,
  MenuItem,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';

import PostTile from './PostTile';
import '../../styles/Community/Community.css';
import { imageBucket, serverURL } from '../../utils/config';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel'

class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comsPerPage: 2,
      numberOfPages: 0,
      currentPage: 1,
      currentPageList: [],
      sortOption: 'votes asc',
      rulesList: [],
      showPostModal: false,
      postType: 'text',
      displayMultiline: 'initial',
      displayLink: 'none',
      displayImageUpload: 'none',
      communityName: '',
      postsCount: 0,
      subscribersCount: 0,
      rules: [],
      description: '',
      posts: [],
      title: '',
      text: '',
      link: '',
      linkDescription: '',
      buttonDisplay: '',
      image: null,
      images: [],
      newImages: [],
      myCommunity: false,
    };
  }

  componentDidMount() {
    this.getCommunityInfo();
  }

  getCommunityData = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    };
    axios.get(`${serverURL}/api/mycommunity`, config)
      .then((res) => {
        const myCommunities = [];
        const { communityName } = this.state;
        if (Array.isArray(res.data)) {
          res.data.forEach((community) => {
            myCommunities.push(community.communityName);
          });
          if (myCommunities.includes(communityName)) {
            this.setState({ myCommunity: true });
          }
        }
      })
  }

  getCommunityInfo = () => {
    const { communityId } = this.props.match.params;
    axios.get(`${serverURL}/api/community-home/${communityId}/${localStorage.getItem('id')}`)
      .then((res) => {
        console.log(res.data);
        const {
          communityName,
          postsCount,
          subscribersCount,
          rules,
          description,
          buttonDisplay,
          posts,
          images,
        } = res.data;
        let imageList = [];
        images.forEach((image) => {
          imageList.push(`${imageBucket}${image}`);
        });
        this.setState({
          communityName,
          postsCount,
          subscribersCount,
          rules,
          description,
          posts,
          buttonDisplay,
          images: imageList,
        }, () => {
          this.changePage(1);
          this.updateComsPerPage(2);
        });
      });
  }

  openModal = () => {
    this.setState({ showPostModal: true });
  }

  closeModal = () => {
    this.setState({ showPostModal: false });
  }
  
  updateComsPerPage = (comsPerPage) => {
    const numberOfPages = Math.ceil(this.state.posts.length / comsPerPage);
    this.setState({ comsPerPage, numberOfPages });
    this.changePage(1, comsPerPage);
  }

  callUpdateComsPerPage = (e, value) => {
    const comsPerPage = value.props.value;
    this.updateComsPerPage(comsPerPage);
  }

  changePage = (currentPage, perPage = null) => {
    let itemsPerPage = null;
    if (perPage === null) {
      itemsPerPage = this.state.comsPerPage;
    } else {
      itemsPerPage = perPage;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = (currentPage * itemsPerPage);
    let currentPageList = [];
    if (this.state.posts) {
      currentPageList = this.state.posts.slice(start, end);
    }
    this.setState({ currentPage, currentPageList }, () => this.getCommunityData());
  }

  callChangePage = (e, value) => {
    this.changePage(value);
  }

  updateSort = (e) => {
    const sortOption = e.target.value;
    const { posts } = this.state;
    switch(sortOption) {
      case 'votes asc':
        posts.sort((a, b) => b.post.postVotes.downvotes - a.post.postVotes.downvotes);
        break;
      case 'votes desc':
        posts.sort((a, b) => b.post.postVotes.upvotes - a.post.postVotes.upvotes);
        break;
      case 'date asc':
        posts.sort((a, b) => new Date(a.post.date) - new Date(b.post.date));
        break;
      case 'date desc':
        posts.sort((a, b) => new Date(b.post.date) - new Date(a.post.date));
        break;
      default:
        break;
    }
    this.setState({ sortOption, posts }, () => {
      this.changePage(1);
    });
  }

  setPostType = (e, value) => {
    let displayMultiline = 'flex';
    let displayLink = 'flex';
    let displayImageUpload = '';
    if (value === 'text') {
      displayLink = 'none';
      displayImageUpload = 'none';
    } else if (value === 'link') {
      displayMultiline = 'none';
      displayImageUpload = 'none';
    } else {
      displayMultiline = 'none';
      displayLink = 'none';
    }
    this.setState({
      postType: value,
      displayMultiline,
      displayLink,
      displayImageUpload,
    });
  }

  setTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  setText = (e) => {
    this.setState({ text: e.target.value });
  }

  setLink = (e) => {
    this.setState({ link: e.target.value });
  }

  setLinkDescription = (e) => {
    this.setState({ linkDescription: e.target.value });
  }

  setNewImages = (e) => {
    this.setState({ newImages: e.target.files });
  }

  createImagePost = async () => {
    const { newImages } = this.state;
    const {
      title,
      postType,
    } = this.state;
    const { communityId } = this.props.match.params;
    const body = new FormData();
    body.append('communityId', communityId);
    body.append('type', postType);
    body.append('title', title);
    for (let i = 0; i < newImages.length; i++) {
      body.append('content', newImages[i]);
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };
    axios.post(`${serverURL}/api/post`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Post created',
          icon: 'success',
        }).then(() => {
          this.setState({ showPostModal: false });
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Post not created',
          icon: 'error',
        });
      });
  }

  createOtherPost = () => {
    const {
      title,
      text,
      link,
      linkDescription,
      postType,
    } = this.state;
    const { communityId } = this.props.match.params;
    const body = new FormData();
    body.append('communityId', communityId);
    body.append('type', postType);
    body.append('title', title)
    if (postType === 'text') {
      body.append('content', text);
    } else if (postType === 'link') {
      const obj = {
        link,
        description: linkDescription,
      }
      const str = JSON.stringify(obj);
      body.append('content', str);
    } else {

    }
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    }
    axios.post(`${serverURL}/api/post`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Post created',
          icon: 'success',
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Post not created',
          icon: 'error',
        });
      });
  }

  createPost = (e) => {
    e.preventDefault();
    const { postType } = this.state;
    if (postType === 'image') {
      this.createImagePost();
    } else {
      this.createOtherPost();
    }
  }

  handleJoinRequest = () => {
    const { communityId } = this.props.match.params;
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    }
    const body = {
      communityId,
    };
    axios.post(`${serverURL}/api/community-home/join-community`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Join request sent',
          icon: 'success',
        }).then(() => {
          this.getCommunityInfo();
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Unable to send join request',
          icon: 'error',
        });
      });
  }

  handleLeaveRequest = () => {
    const { communityId } = this.props.match.params;
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
      data: { communityId },
    };
    console.log(token);
    console.log(communityId);
    axios.delete(`${serverURL}/api/community-home/`, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Left community',
          icon: 'success',
        }).then(() => {
          this.getCommunityInfo();
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Unable to leave community',
          icon: 'error',
        });
      });
  }

  handleMembershipRequest = () => {
    const { buttonDisplay } = this.state;
    switch (buttonDisplay) {
      case 'Join':
        this.handleJoinRequest();
        break;
      case 'Leave':
        this.handleLeaveRequest();
        break;
      default:
        break;
    }
  }

  render() {
    const {
      comsPerPage,
      numberOfPages,
      currentPage,
      currentPageList,
      sortOption,
      showPostModal,
      postType,
      displayLink,
      displayMultiline,
      displayImageUpload,
      communityName,
      postsCount,
      subscribersCount,
      rules,
      buttonDisplay,
      description,
      images,
      myCommunity,
    } = this.state;
    const { communityId } = this.props.match.params;

    return (
      <section id="community-home-page">
        <Paper id="post-list-options">
          {buttonDisplay.toLowerCase() !== '' &&
            <Button
              onClick={this.handleMembershipRequest}
              disabled={buttonDisplay === 'Waiting For Approval' ? true : false}
            >
              {buttonDisplay}
            </Button>
          }
          <Select
            label="Items"
            value={comsPerPage}
            onChange={this.callUpdateComsPerPage}
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
          <Select
            value={sortOption}
            onChange={this.updateSort}
          >
            <MenuItem value={"votes asc"}>Least Popular</MenuItem>
            <MenuItem value={"votes desc"}>Most Popular</MenuItem>
            <MenuItem value={"date asc"}>Oldest First</MenuItem>
            <MenuItem value={"date desc"}>Newest First</MenuItem>
          </Select>
        </Paper>
        <List id="posts-list">
          {currentPageList.map((community) => {
            return (
              <div>
                <PostTile
                  title={community.post.title}
                  id={community.post.id}
                  key={community.post.id}
                  user={community.post.creatorName}
                  votes={community.post.postVotes}
                  date={new Date(community.post.date)}
                  communityId={communityId}
                  membership={buttonDisplay}
                  updateDisplay={this.getCommunityInfo}
                />
              </div>
            )
          } )}
        </List>
        <Paper id="posts-pagination">
          <Pagination
            count={numberOfPages}
            page={currentPage}
            onChange={this.callChangePage}
          />
        </Paper>
        <Paper id="community-info" style={{ maxWidth: "575px"}}>
          <Typography variant="h4">{communityName}</Typography>
          <section className="community-description-item">
            <Typography variant="h6">{subscribersCount} Subscribers</Typography>
          </section>
          <section className="community-description-item">
            <Typography variant="h6">{postsCount} Posts</Typography>
          </section>
          {description &&
            <section className="community-description-item">
              <Typography variant="h6">Description</Typography>
              <Typography>{description}</Typography>
            </section>
          }
          <section className="community-description-item">
            <Typography variant="h6">Rules</Typography>
            <ol>
              {rules.map((rule, index) => (
                <li key={index}>
                  <Typography style={{ fontWeight: 600 }}>{rule.title}</Typography>
                  <Typography>{rule.description}</Typography>
                </li>
              ))}
            </ol>
          </section>
          {((buttonDisplay.toLowerCase() === 'leave') || myCommunity) &&
            <section className="community-description-item">
              <Button
                style={{width: "100%"}}
                variant="outlined"
                onClick={this.openModal}
              >
                Post
              </Button>
            </section>
          }
          {images &&
            <section
              className="community-description-item"
            >
              <Carousel showThumbs={false}>
                {images.map((image) => (
                  <div>
                    <img className="community-gallery-item" src={image} alt="Community Gallery Item" />
                  </div>
                ))}
              </Carousel>
            </section>
          }
        </Paper>
        <Modal
          open={showPostModal}
          onClose={this.closeModal}
          id="post-modal"
        >
          <Paper id="create-post-window">
            <FormControl component="fieldset">
              <FormLabel component="legend">Post Type</FormLabel>
              <RadioGroup value={postType} onChange={this.setPostType}>
                <FormControlLabel value="text" control={<Radio />} label="Text" />
                <FormControlLabel value="link" control={<Radio />} label="Link" />
                <FormControlLabel value="image" control={<Radio />} label="Image" />
              </RadioGroup>
            </FormControl>
            <form id="create-post-form" onSubmit={this.createPost}>
              <TextField
                label="Title"
                onChange={this.setTitle}
                required
                className="create-post-element"
              />
              <TextField
                label="Text"
                onChange={this.setText}
                inputProps={{ maxLength: 180 }}
                multiline
                style={displayMultiline === 'none' ? { display: 'none' } : {}}
                required={displayMultiline === 'none' ? false : true}
                className="create-post-element"
              />
              <TextField
                label="Link"
                onChange={this.setLink}
                style={displayLink === 'none' ? { display: 'none' } : {}}
                required={displayLink === 'none' ? false : true}
                type="url"
                className="create-post-element"
              />
              <TextField
                label="Description"
                onChange={this.setLinkDescription}
                style={displayLink === 'none' ? { display: 'none' }: {}}
                required={displayLink === 'none' ? false : true}
                className="create-post-element"
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                onChange={this.setNewImages}
                multiple
                type="file"
                required={displayImageUpload === 'none' ? false : true}
              />
              <label htmlFor="raised-button-file" style={displayImageUpload === 'none' ? { display: 'none' } : {}}>
                <Button
                  variant="outlined"
                  component="span"
                  className="create-post-element"
                >
                  Upload Image
                </Button>
              </label>
              <Button
                variant="outlined"
                type="submit"
                className="create-post-element"
              >
                submit
              </Button>
            </form>
          </Paper>
        </Modal>
      </section>
    );
  }
}

export default withRouter(Community);