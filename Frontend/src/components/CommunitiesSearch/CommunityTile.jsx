import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  ButtonBase,
  Paper,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

import '../../styles/CommunitiesSearch/CommunityTile.css';
import { serverURL } from '../../utils/config';

class CommunitiyTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: 50,
    }
  }

  goToCommunity = () => {
    const { id } = this.props;
    this.props.history.push(`/community/${id}`)
  }

  voteCommunity = (vote) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    const body = {
      communityId: this.props.id,
      vote,
    };
    axios.post(`${serverURL}/api/mycommunity/vote/`, body, config)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Post has been upvoted',
          icon: 'success',
        });
      }).catch((err) => {
        swal({
          title: 'Failed',
          text: 'Post has already been voted on',
          icon: 'error',
        });
      });
  }

  render() {
    const {
      title,
      description,
      image,
      votes,
      users,
      date,
      postsCount,
      postUpvotes,
    } = this.props;
    return (
      <Card className="community-tile">
        <CardActions className="community-vote-area">
          <IconButton className="vote-item" onClick={() => this.voteCommunity(1)}>
            <ArrowDropUp />
          </IconButton>
          <Typography className="vote-item">
            {votes}
          </Typography>
          <IconButton className="vote-item" onClick={() => this.voteCommunity(0)}>
            <ArrowDropDown />
          </IconButton>
        </CardActions>
        <ButtonBase className="community-clickable-area" onClick={this.goToCommunity}>
          <CardMedia
            style={{ width: "150px", height: "150px" }}
            title="image"
            image={image}
          />
          <CardContent className="community-description-content">
            <Typography variant="h6">{title}</Typography>
            <Typography>{description}</Typography>
            <Typography>{users} Users</Typography>
            <Typography>{new Date(date).toDateString()}</Typography>
            <Typography>{postsCount} Posts</Typography>
            <Typography>{postUpvotes} Post Karma</Typography>
          </CardContent>
        </ButtonBase>
      </Card>
    )
  }
}

CommunitiyTile.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  votes: PropTypes.number.isRequired,
  users: PropTypes.number.isRequired,
}

export default withRouter(CommunitiyTile);