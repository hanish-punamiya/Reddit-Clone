import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  ButtonBase,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import axios from 'axios';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';

import '../../styles/Community/PostTile.css';
import { serverURL } from '../../utils/config';

class PostTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upvotes: this.props.votes.upvotes,
      downvotes: this.props.votes.downvotes,
    };
  }

  voteOnPost = (vote) => {
    const postId = this.props.id;
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
          this.props.updateDisplay();
        });
      }).catch(() => {
        swal({
          title: 'Failed',
          text: 'Cannot vote twice',
          icon: 'error',
        });
      });
  }

  goToPost = () => {
    const { id, communityId, membership } = this.props;
    this.props.history.push(`/post/${id}/${communityId}/${membership}`);
  }

  render() {
    const {
      title,
      image,
      date,
      user,
    } = this.props;
    const {
      upvotes,
      downvotes,
    } = this.state;
    return (
      <Card className="post-tile">
        <CardActions className="post-vote-area">
          <IconButton className="post-vote-item" onClick={() => this.voteOnPost(1)}>
            <ArrowDropUp />
          </IconButton>
          <Typography className="post-vote-item">
            {upvotes}
          </Typography>
          <Typography className="post-vote-item">
            {downvotes}
          </Typography>
          <IconButton className="post-vote-item" onClick={() => this.voteOnPost(0)}>
            <ArrowDropDown />
          </IconButton>
        </CardActions>
        <ButtonBase className="post-clickable-area" onClick={this.goToPost}>
          <CardMedia
            style={{ width: "150px", height: "150px" }}
            title="image"
            image={image}
          />
          <CardContent className="post-description-content">
            <Typography className="post-tile-title" variant="h6">{title}</Typography>
            {/* <Typography className="post-tile-description">{description}</Typography> */}
            <Typography className="post-tile-community">Community Name</Typography>
            <Typography className="post-tile-user">{user}</Typography>
            <Typography className="post-tile-date">{date.toDateString()}</Typography>
          </CardContent>
        </ButtonBase>
      </Card>
    );
  }
};

export default withRouter(PostTile);