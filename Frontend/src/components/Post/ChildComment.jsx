import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Reply } from '@material-ui/icons';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { imageBucket, serverURL } from '../../utils/config';
import ProfilePicture from '../../ProfilePic.jpg';

class ChildComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      date: "",
      name: "",
      childComments: [],
    }
  }

  componentDidMount() {
    this.getCommentInfo();
  }

  getCommentInfo = () => {
    const {
      text,
      date,
      children,
      creatorId,
      id,
    } = this.props.comment;
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    }
    axios.get(`${serverURL}/api/user/${creatorId}`, config)
      .then((res) => {
        let profilePic = null;
        if(res.data.profilePicture) {
          profilePic = `${imageBucket}${res.data.profilePicture}`;
        } else {
          profilePic = ProfilePicture;
        }
        this.setState({
          text,
          date,
          childComments: children,
          name: `${res.data.firstName} ${res.data.lastName}`,
          profilePic,
          commentId: id,
        });
      });

  }

  render() {
    const {
      text,
      date,
      name,
      childComments,
      profilePic,
      commentId,
    } = this.state;
    const { level, membership, myCommunity } = this.props;
    return (
      <div>
        <Card className="comment-tile" style={{ marginLeft: `${level * 12}px` }}>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <CardMedia
              style={{ width: "75px", height: "75px" }}
              title="image"
              image={profilePic}
            />
          </div>
          <CardContent className="comment-content">
            <Typography style={{ gridArea: 'text' }}>{text}</Typography>
            <Typography style={{ gridArea: 'date' }}>{new Date(date).toDateString()}</Typography>
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
            level={level + 1}
            openCommentModal={this.props.openCommentModal}
            myCommunity={myCommunity}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(ChildComment);