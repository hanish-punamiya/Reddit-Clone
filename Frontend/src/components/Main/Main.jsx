import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Route, Link, withRouter } from 'react-router-dom';
import { AccountCircle } from '@material-ui/icons';

import Dash from "../Dash/Dash";
import Communities from "../Communities/Communities";
import Messages from "../Messages/Messages";
import SearchBar from "../Messages/Search/SearchBar";
import UserProfile from "../Profile/UserProfile/UserProfile";
import MyCommunities from "../MyCommunities/MyCommunities";
import EditCommunity from "../MyCommunities/EditCommunity";
import MyProfile from "../Profile/MyProfile/MyProfile";
import Moderation from "../Moderation/Moderation";
import Invitations from "../Invitations/Invitations";
import CommunitiesSearch from '../CommunitiesSearch/CommunitiesSearch';
import Community from '../Community/Community';
import Post from '../Post/Post';
import InvitationsAcceptDecline from '../InvitationsUser/AcceptDecline';
import '../../styles/Main/Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    }
  }

  openMenu = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  }

  closeMenu = () => {
    this.setState({ anchorEl: null });
  }

  logout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }

  toSignIn = () => {
    this.props.history.push('/login');
  }

  render() {
    const {
      anchorEl,
    } = this.state;
    const token = localStorage.getItem('token');
    return (
      <div id="main-content-container">
        <AppBar position="sticky" style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Tabs>
            <Tab label="Home" component={Link} to={"/dash"} />
            <Tab label="Messages" component={Link} to={"/messages"} />
            <Tab label="My Communities" component={Link} to={"/mycommunities"} />
            <Tab label="Search" component={Link} to={'/communities_search'} />
            <Tab label="Moderation" component={Link} to={'/moderation'} />
            <Tab label="Send Invites" component={Link} to={'/invitations'} />
            <Tab label="View Invites" component={Link} to={'/invitationsAcceptDecline'} />
            <SearchBar></SearchBar>
          </Tabs>
          <IconButton onClick={this.openMenu}>
            <AccountCircle style={{ color: "white" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.closeMenu}
          >
            <MenuItem
              style={ token === null ? { display: 'none' } : {} }
              onClick={() => this.props.history.push('/myprofile')}
            >
              My Profile
            </MenuItem>
            <MenuItem
              style={ token === null ? { display: 'none' } : {} }
              onClick={this.logout}
            >
              Logout
            </MenuItem>
            <MenuItem
              style={ token === null ? {} : { display: 'none' } }
              onClick={this.toSignIn}
            >
              Log In
            </MenuItem>
          </Menu>
        </AppBar>
        <section>
          <Route path="/dash" exact>
            <Dash />
          </Route>
          <Route path="/messages" exact>
            <Messages />
          </Route>
          <Route path="/communities" exact>
            <Communities />
          </Route>
          <Route path="/userprofile" exact>
            <UserProfile />
          </Route>
          <Route path="/mycommunities" exact>
            <MyCommunities />
          </Route>
          <Route path="/myprofile" exact>
            <MyProfile />
          </Route>
          <Route path="/editcommunity" exact>
            <EditCommunity />
          </Route>
          <Route path="/moderation" exact>
            <Moderation />
          </Route>
          <Route path="/invitations" exact>
            <Invitations />
          </Route>
          <Route path="/communities_search">
            <CommunitiesSearch />
          </Route>
          <Route path="/community/:communityId">
            <Community />
          </Route>
          <Route path="/post/:postId/:communityId/:membership?">
            <Post />
          </Route>
          <Route path="/invitationsAcceptDecline" exact>
            <InvitationsAcceptDecline />
          </Route>
        </section>
      </div>
    );
  }
}

export default withRouter(Main);
