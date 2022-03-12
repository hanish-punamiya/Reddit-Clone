import React from 'react';
import {
  Typography,
  Paper,
  List,
  TextField,
  Button,
  Modal,
  IconButton,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { Carousel } from 'react-responsive-carousel';

import '../../styles/Post/Post.css';
import { imageBucket, serverURL } from '../../utils/config';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Comment from './Comment';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      text: '',
      images: [],
      link: '',
      description: '',
      user: '',
      community: '',
      date: '',
      type: '',
      upvotes: 0,
      downvotes: 0,
      comments: [],
      creatorId: '',
      newComment: '',
      commentModalOpen: false,
      focusedComment: null,
      newChildComment: '',
      myCommunity: false,
    }
  }

  componentDidMount() {
    this.getPostData();
  }

  getPostData = () => {
    const { postId } = this.props.match.params;
    axios.get(`${serverURL}/api/post/${postId}/null/null`)
      .then((res) => {
        let post = res.data[0];
        post = post.post[0];
        const { communityId, creatorId } = post;
        axios.get(`${serverURL}/api/post/${postId}/${communityId}/null`)
          .then((res) => {
            let post = res.data[0];
            let votes = res.data[1];
            post = post.post[0];
            votes = votes.postVotes;
            const {
              title,
              content,
              date,
              creatorName,
              type,
            } = post;
            const { comments } = res.data[res.data.length - 1];
            const commentVotes = res.data.slice(2, res.data.length - 2);
            const commentList = [];
            if (comments) {
              comments.forEach((comment) => {
                const newComment = {};
                newComment.id = comment.id;
                newComment.text = comment.text;
                newComment.date = comment.date;
                newComment.creatorId = comment.creatorId;
                newComment.creatorName = comment.creatorName;
                newComment.children = comment.children
                commentVotes.forEach((vote) => {
                  if (vote[comment.id.toString()]) {
                    newComment.upvotes = vote[comment.id.toString()].upvotes;
                    newComment.downvotes = vote[comment.id.toString()].downvotes;
                  }
                });
                commentList.push(newComment);
              });
            }
            commentList.sort((a, b) => b.upvotes - a.upvotes);
            const {
              upvotes,
              downvotes,
            } = votes;
            let link = '';
            let description = '';
            if (type.toLowerCase() === 'link') {
              if (JSON.parse(content)) {
                link = JSON.parse(content).link;
                description = JSON.parse(content).description;
              }
            }
            let imageList = [];
            const images = [];
            if (type.toLowerCase() === 'image') {
              if (content) {
                imageList = content.split(',');
                imageList.forEach((image) => {
                  images.push(`${imageBucket}${image}`);
                });
              }
            }
            axios.get(`${serverURL}/api/community-home/${communityId}/null`)
              .then((res) => {
                const { communityName } = res.data;
                this.setState({
                  title,
                  content,
                  date,
                  user: creatorName,
                  type,
                  community: communityName,
                  link,
                  description,
                  upvotes,
                  downvotes,
                  images,
                  comments: commentList,
                  creatorId,
                  newComment: '',
                  newChildComment: '',
                  commentModalOpen: false,
                }, () => this.getCommunityData());
              });
          })
      }).catch(() => {
        swal({
          title: 'Error',
          text: 'Error occured fetching data',
          icon: 'error',
        });
      });
  }

  getCommunityData = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    };
    axios.get(`${serverURL}/api/mycommunity`, config)
      .then((res) => {
        const myCommunities = [];
        const { community } = this.state;
        if (Array.isArray(res.data)) {
          res.data.forEach((community) => {
            myCommunities.push(community.communityName);
          });
          if (myCommunities.includes(community)) {
            this.setState({ myCommunity: true });
          }
        }
      })
  }

  updateNewComment = (e) => {
    this.setState({ newComment: e.target.value });
  }

  submitNewComment = (e) => {
    e.preventDefault();
    const { postId } = this.props.match.params;
    const { newComment } = this.state;
    const body = {
      postId,
      text: newComment,
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    };
    axios.post(`${serverURL}/api/comment`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Comment Added',
          icon: 'success',
        }).then(() => {
          this.getPostData();
        })
      }).catch(() => {
        swal({
          title: 'Error',
          text: 'Comment Could Not Be Added',
          icon: 'error',
        });
      });
  }

  openCommentModal = (focusedComment) => {
    this.setState({ commentModalOpen: true, focusedComment });
  }

  closeCommentModal = () => {
    this.setState({ commentModalOpen: false, focusedComment: null });
  }

  setChildComment = (e) => {
    this.setState({ newChildComment: e.target.value });
  }

  addChildComment = (e) => {
    e.preventDefault();
    const { postId } = this.props.match.params;
    const {
      newChildComment,
      focusedComment,
    } = this.state;
    if (localStorage.getItem('token') === null) {
      swal({
        title: 'Failed',
        text: 'Must be logged in to comment',
        icon: 'error',
      });
    }
    const body = {
      postId,
      text: newChildComment,
      parentId: focusedComment,
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    };
    axios.post(`${serverURL}/api/comment`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Comment Added',
          icon: 'success',
        }).then(() => {
          this.getPostData();
        });
      }).catch(() => {
        swal({
          title: 'Error',
          text: 'Comment Could Not Be Added',
          icon: 'error',
        });
      }); 
  }

  voteOnPost = (vote) => {
    const { postId } = this.props.match.params;
    const body = {
      postId,
      vote,
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    axios.post(`${serverURL}/api/post/vote`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Vote successful',
          icon: 'success',
        }).then(() => {
          this.getPostData();
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Cannot vote twice',
          icon: 'error',
        });
      });
  }

  render() {
    const {
      title,
      images,
      link,
      description,
      user,
      community,
      date,
      type,
      content,
      comments,
      newComment,
      commentModalOpen,
      upvotes,
      downvotes,
      myCommunity,
    } = this.state;
    const {
      membership,
    } = this.props.match.params;
    return (
      <div id="post-page">
        <Paper id="post-content">
          <section id="post-content-section">
            <Typography variant="h4">{title}</Typography>
            {type.toLowerCase() === 'link' &&
              <>
                <a target="_blank" href={link} rel="noreferrer">{link}</a>
                <Typography>{description}</Typography>
              </>
            }
            {type.toLowerCase() === 'text' &&
              <>
                <Typography>{content}</Typography>
              </>
            }
            {type.toLowerCase() === 'image' &&
              <section id="post-gallery-section">
                {images &&
                  <div id="post-gallery" style={type === 'image' ? {} : {display: 'none'}}>
                    <Carousel showThumbs={false}>
                      {images.map((image) => (
                        <div>
                          <img className="post-gallery-image" src={image} alt="Post Content" />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                }
              </section>
            }
            <section id="post-info">
              <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => this.voteOnPost(1)}>
                  <ArrowDropUp />
                </IconButton>
                <Typography>{upvotes}</Typography>
                <Typography>{downvotes}</Typography>
                <IconButton onClick={() => this.voteOnPost(0)}>
                  <ArrowDropDown />
                </IconButton>
              </section>
              <Typography>Posted by {user}</Typography>
              <Typography>{new Date(date).toDateString()}</Typography>
              <Typography>Community: {community}</Typography>
            </section>
          </section>
          {(myCommunity || membership === 'Leave') &&
            <form onSubmit={this.submitNewComment} id="new-comment-form">
              <TextField
                multiline
                variant="outlined"
                label="New Comment"
                onChange={this.updateNewComment}
                value={newComment}
                required
              />
              <Button type="submit" variant="outlined">Submit</Button>
            </form>
          }
          <List>
            {comments.map((comment) => (
              <Comment
                commentId={comment.id}
                key={comment.id}
                text={comment.text}
                date={new Date(comment.date).toDateString()}
                creatorId={comment.creatorId}
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                childComments={comment.children}
                openCommentModal={this.openCommentModal}
                updatePage={this.getPostData}
                myCommunity={myCommunity}
              />
            ))}
          </List>
        </Paper>
        <Modal open={commentModalOpen} onClose={this.closeCommentModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper>
            <form onSubmit={this.addChildComment} className="child-comment-modal">
              <TextField variant="outlined" label="Comment" required onChange={this.setChildComment}/>
              <Button variant="outlined" type="submit">Submit</Button>
            </form>
          </Paper>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Post);