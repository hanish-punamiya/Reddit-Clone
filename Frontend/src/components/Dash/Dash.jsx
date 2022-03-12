import React from 'react';
import {PostCard} from "./Post";
import {PostCardImage} from "./Post";

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SendIcon from '@material-ui/icons/Send';
import Box from '@material-ui/core/Box';




import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {fetchPosts} from "../../actions/dashboardAction";
import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
  root: {
    width: '100%',
    minWidth: 500,
    backgroundColor: ["white"]
  },
});

const options = [
    '(No Filter)',
    'Most Upvoted',
    'Most Number of Users',
    'Most Comments',
    'Created at (Ascending)',
    'Created at (Descending)'
];


class Dash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      anchorEl: null,
      selectedIndex: 1,
      with_filter: false,
      filtered_posts: []
    }
  }

  filterPosts = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      this.setState({
        with_filter: false,
        filtered_posts: []
      })
    } else if (this.state.posts !== []) {
      let tempPosts = [];

      for (let entry in this.state.posts) {
        if (this.state.posts[entry]['title'].toLowerCase().includes(e.target.value.toLowerCase()) ||
            this.state.posts[entry]['text'].toLowerCase().includes(e.target.value.toLowerCase())) {
          tempPosts.push(this.state.posts[entry]);
        }
      }
      this.setState({
        filtered_posts: tempPosts,
        with_filter: true
      })
    }

  }

  sortPosts = () => {
    const index = this.state.selectedIndex;
    // If sorting index is no filter or descending, normal reverse-chronological ordering
    if(index === 0 || index === 5) {
      this.setState({
        posts: this.state.posts.sort((a,b) => (a.dateCreated > b.dateCreated) ? 1 : -1)
      })
    }
    // Sort by Most Upvoted
    else if(index === 1) {
      this.setState({
        posts: this.state.posts.sort((a,b) => (a.upVoteCount < b.upVoteCount) ? 1 : -1)
      })
    }
    // Sort by Most Number of Users
    else if(index === 2) {
      // TODO: Find way to get user count
    }
    // Sort by Most comments
    else if(index === 3) {
      this.setState({
        posts: this.state.posts.sort((a,b) => (a.comments.length < b.comments.length) ? 1 : -1)
      })
    }
    // Sort by Created at Ascending
    else if(index === 4 ) {
      this.setState({
        posts: this.state.posts.sort((a,b) => (a.dateCreated < b.dateCreated) ? 1 : -1)
      })
    }
  }

  handleClickListItem = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  handleMenuItemClick = async (event, index) => {
    await this.setState({
      selectedIndex: index,
      anchorEl: null
    })
    this.sortPosts();
  }

  handleClose = () => {
    this.setState({
      anchorEl: null
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.posts_for_user !== this.props.posts_for_user) {
      this.setState({
        posts: this.props.posts_for_user
      });
    }

  }

  componentDidMount() {
    // Fetch all the posts
    this.props.fetchPosts(); // TODO: Go back and add correct credentials to get posts
  }

  render() {
    const {classes} = this.props;

    let posts_current;
    if(this.state.with_filter) {
      posts_current = this.state.filtered_posts;
    }
    else {
      posts_current = this.state.posts;
    }

    const allPosts = posts_current.map( entry => {
      if(entry.type === 'Text' || entry.type === 'Link' || entry.type === 'text' || entry.type === 'link') {
        return (
            <ListItem>
              <PostCard title={entry.title} creator={entry.creator} community={entry.community}
                        dateCreated={entry.dateCreated} text={entry.text} upvote={entry.upVoteCount}
                        downvote={entry.downVoteCount} id={entry.id} comments={entry.comments}
                        yesVote={entry.voteYes} noVote={entry.voteNo} root_comments={entry.root_comments}/>
            </ListItem>
        )
      }
      else if(entry.type === 'image' || entry.type === 'Image') {
        return (
            <ListItem>
              <PostCardImage title={entry.title} creator={entry.creator} community={entry.community}
                        dateCreated={entry.dateCreated} image={entry.image} upvote={entry.upVoteCount}
                        downvote={entry.downVoteCount} id={entry.id} comments={entry.comments}
                             yesVote={entry.voteYes} noVote={entry.voteNo} root_comments={entry.root_comments}/>
            </ListItem>
        )
      }

    })



    return (
        <div className={classes.root}>

          <Grid container direction='row' justify="center" spacing={2}>

            <Grid container>
              <Grid item style={{paddingLeft: 40}}>
                <h1 style={{fontFamily: 'Helvetica'}}>My Dashboard</h1>
              </Grid>
            </Grid>

            <Grid container justify='flex-end'>
              <Grid item style={{paddingRight: 200}}>
                <input style={{borderRadius: 4}} onChange={this.filterPosts} type="text" name="filtergroups"
                       placeholder="Search Posts"/>
              </Grid>
            </Grid>



            <div style={{display: "flex", border: '1px solid blue', width: 1500, marginTop: 20}}>

              <div style={{padding: 40}}>

                <Grid item lg={4} border={1}>

                  <Box display="flex" style={{width: 200}} border={1}>


                    <List style={{width: '100%'}} aria-label="Device settings">
                      <ListItem
                          button
                          aria-haspopup="true"
                          aria-controls="lock-menu"
                          aria-label="Sort Posts by"
                          onClick={this.handleClickListItem}
                      >
                        <ListItemText primary="Sort Posts by" secondary={options[this.state.selectedIndex]} />
                      </ListItem>
                    </List>
                    <Menu
                        id="lock-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                      {options.map((option, index) => (
                          <MenuItem
                              key={option}
                              selected={index === this.state.selectedIndex}
                              onClick={(event) => this.handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Grid>
              </div>

              <div style={{padding: 40, marginLeft: 40}}>
                <Grid item lg={12}>
                  <List component="nav" aria-label="posts in communities">
                    {allPosts}
                  </List>
                </Grid>
              </div>


            </div>



          </Grid>


        </div>
    );
  }
}

Dash.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return ({
    posts_for_user: state.dashboard.all_posts
  })
};

export default connect(mapStateToProps, {fetchPosts})(withStyles(useStyles)(Dash));
