import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown, Reply } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

import ChildComment from './ChildComment';
import { imageBucket, serverURL } from '../../utils/config';
import '../../styles/Post/Comment.css';
import ProfilePicture from '../../ProfilePic.jpg';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      profilePic: '',
      commentId: '',
      upvotes: this.props.upvotes,
      downvotes: this.props.downvotes,
    };
  }

  componentDidMount() {
    this.getProfileInfo();
  }

  getProfileInfo = () => {
    const { creatorId, commentId } = this.props;
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    };
    axios.get(`${serverURL}/api/user/${creatorId}`, config)
      .then((res) => {
        this.setState({
          name: `${res.data.firstName} ${res.data.lastName}`,
          profilePic: res.data.profilePicture,
          commentId,
        });
      });
  }

  voteOnPost = (vote) => {
    const { commentId } = this.state;
    const body = {
      commentId,
      vote,
      userId: localStorage.getItem('id'),
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    axios.post(`${serverURL}/api/comment/vote`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Vote successful',
          icon: 'success',
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Cannot vote twice',
          icon: 'error',
        });
      });
  }

  openCommentModal = () => {
    console.log('modal');
    this.props.openCommentModal();
  }

  render() {
    const {
      text,
      date,
      childComments,
      myCommunity,
    } = this.props;
    const {
      name,
      profilePic,
      commentId,
      upvotes,
      downvotes,
    } = this.state;
    const {
      membership,
    } = this.props.match.params;

    return (
      <div>
        <Card className="comment-tile">
          <CardActions className="comment-vote-section">
            <IconButton className="comment-vote-item" onClick={() => this.voteOnPost(1)}>
              <ArrowDropUp />
            </IconButton>
            <Typography className="comment-vote-item">
              {upvotes}
            </Typography>
            <Typography className="comment-vote-item">
              {downvotes}
            </Typography>
            <IconButton className="comment-vote-item" onClick={() => this.voteOnPost(0)}>
              <ArrowDropDown />
            </IconButton>
          </CardActions>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <CardMedia
              style={{ width: "75px", height: "75px" }}
              title="image"
              image={profilePic ? `${imageBucket}${profilePic}` : ProfilePicture}
            />
          </div>
          <CardContent className="comment-content">
            <Typography style={{ gridArea: 'text' }}>{text}</Typography>
            <Typography style={{ gridArea: 'date' }}>{date}</Typography>
            <Typography style={{ gridArea: 'user' }}>{name}</Typography>
            {(myCommunity || membership === 'Leave') &&
              <IconButton
                style={{ gridArea: 'reply', padding: '0px' }}
                onClick={() => this.props.openCommentModal(commentId)}
              >
                <Reply />
              </IconButton>
            }
          </CardContent>
        </Card>
        {childComments && childComments.map((child) => (
          <ChildComment
            comment={child}
            level={2}
            creatorId={this.props.creatorId}
            openCommentModal={this.props.openCommentModal}
            membership={membership}
            myCommunity={myCommunity}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(Comment);