import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Pagination from "@material-ui/lab/Pagination";
import {InvitedUser, SelectedUser} from "./UserCards";
import Button from "./Button";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {searchForUsers, fetchCommunities, fetchInvites} from "../../actions/invitationAction";
import {Box} from "@material-ui/core";


const useStyles = theme => ({
    root: {
        width: '100%',
        minWidth: 500,
        backgroundColor: ["white"]
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});


class Invitations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searched_users: [{firstName: "(None", lastName: "searched)", email: "(None)", id : "515157448548518552"}],
            anchorEl: null,
            selectedIndex: 1,
            with_filter: false,
            filtered_users: [],
            selected_users: [],
            selected_community: [],
            search_string: "",
            my_community_list: [],
            noOfPages: null,
            itemsPerPage: 3,
            page: 1,
            sent_invites: [{firstName: "(No invites", lastName: "sent)", time: "", community: "(None)"}]
        }
    }

    filterUsers = (e) => {
        e.preventDefault();
        this.setState({
            search_string: e.target.value
        });
    }

    searchForUsers = (e) => {
        e.preventDefault();
        this.props.searchForUsers(this.state.search_string);
    }

    handleClose = () => {
        this.setState({
            anchorEl: null
        })
    }

    handleChange = (event,value) => {
        event.preventDefault();
        this.setState({
            page: value
        });
    }

    addToSelected = (userID, name, email) => {

        // Only add if not already in list
        if(this.state.selected_users.map(function(item) {return item.id}).indexOf(userID) === -1) {
            let add_user = this.state.selected_users;
            console.log(add_user)
            add_user.push({id: userID, name: name, email: email});

            this.setState({
                selected_users: add_user
            })
        }

    }

    removeFromSelected = (userID) => {

        const removeIndex = this.state.selected_users.map(function(item) {return item.id}).indexOf(userID);
        console.log("The remove index", removeIndex);

        if(removeIndex === 0 && this.state.selected_users.length === 1) {
            this.setState({
                selected_users: []
            });
        }

        else {
            let tempSplice = this.state.selected_users
                tempSplice.splice(removeIndex,1);

            this.setState({
                selected_users: tempSplice
            });
        }
        console.log("Items left", this.state.selected_users);
    }

    handleCommunityChange = (event) => {

        let values = event.target.value.split(",");
        let final = [values[0],values[1]]
        this.setState({
            selected_community: final
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.searched_users_back !== this.props.searched_users_back) {
            this.setState({
                searched_users: this.props.searched_users_back
            });
        }

        if(prevProps.user_communities !== this.props.user_communities) {
            this.setState({
                my_community_list: this.props.user_communities
            });
        }

        if(prevProps.my_sent_invites_local !== this.props.my_sent_invites_local) {
            this.setState({
                sent_invites: this.props.my_sent_invites_local,
                noOfPages: Math.ceil(this.props.my_sent_invites_local.length / this.state.itemsPerPage)
            });
        }

    }
    componentDidMount() {
        // Fetch my communities
        this.props.fetchCommunities();
        // Fetch all invites I've sent
        this.props.fetchInvites();
    }


    render() {
        const {classes} = this.props;

        let users_current;
        if(this.state.with_filter) {
            users_current = this.state.filtered_users;
        }
        else {
            users_current = this.state.searched_users;
        }

        const currentUsers = users_current.map( entry => {

                return (
                    <ListItem>
                            <SelectedUser name={entry.firstName + " " +entry.lastName}
                                          id={entry.id}
                                          email={entry.email}
                                          type='add' add={this.addToSelected}/>
                    </ListItem>
                )
        })

        const selectedUsers = this.state.selected_users.map( entry => {

            return (
                <ListItem>
                        <SelectedUser name={entry.name}
                                      id={entry.id}
                                      email={entry.email}
                                      type='remove' add={this.removeFromSelected}/>
                </ListItem>
            )
        })

        const myCommunityList = this.state.my_community_list.map( entry => {

            return (
                <MenuItem value={entry.id+","+entry.name}>{entry.name}</MenuItem>
            )
        })


        let myInvitations;

        if(this.state.sent_invites.length === 0) {
            myInvitations = (
                <ListItem>
                    <h5>Currently no pending invites</h5>
                </ListItem>
            )
        }

        else {
            myInvitations = this.state.sent_invites.slice((this.state.page - 1) * this.state.itemsPerPage,
                this.state.page * this.state.itemsPerPage).map( entry => {
                return (
                    <ListItem>
                        <InvitedUser name={entry.firstName+" "+entry.lastName}
                                     time={entry.time}
                                     community={entry.community}/>
                    </ListItem>
                )
            })
        }



        return (
            <div className={classes.root}>

                <Grid container direction='column' spacing={2}>

                    <Grid item>
                        <Grid container direction='row' justify="center" spacing={2}>

                            <div style={{display: "flex", border: '1px solid blue', marginTop: 20}}>

                                <div style={{padding: 40, border: '1px solid black', minWidth: 550}}>
                                    <h3>Find Users</h3>
                                    <Grid item lg={12}>
                                        <List style={{height: 300, overflow: 'auto'}}>
                                            {currentUsers}
                                        </List>
                                    </Grid>
                                </div>

                                <div style={{padding: 40, justifyContent: 'center'}}>
                                    <Grid item lg={4}>
                                        <input style={{borderRadius: 4}} onChange={this.filterUsers}
                                               type="text" name="findusers"
                                               placeholder="Search Users"/>
                                               <button
                                                   onClick={this.searchForUsers}
                                               >Search</button>
                                    </Grid>
                                </div>

                                <div style={{padding: 40, border: '1px solid black', minWidth: 550}}>
                                    <h3>Selected Users</h3>
                                    <Grid item lg={12}>
                                        <List style={{height: 300, overflow: 'auto'}}>
                                            {selectedUsers}
                                        </List>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>


                    <Grid item justify='flex-end'>
                        <Grid container direction='row' justify='flex-end'>

                            <div style={{display: 'flex', width: 800, marginTop: 15, marginRight: 10, justifyContent: 'center'}}>

                                <div style={{float: "right", marginRight: 5}}>
                                    <Button communityInfo={this.state.selected_community}
                                    users={this.state.selected_users}>Send Invites</Button>
                                </div>

                                <div style={{float: "right"}}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">Invite to</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.selected_community[1]}
                                            onChange={this.handleCommunityChange}
                                        >
                                            {myCommunityList}
                                        </Select>
                                    </FormControl>
                                </div>

                            </div>
                        </Grid>
                    </Grid>


                </Grid>

                <Grid container direction='row' justify="center" spacing={2}>

                    <div style={{display: "flex", justifyContent: 'center', border: '1px solid blue', width: 900, marginTop: 20}}>

                        <div style={{padding: 40}}>
                            <h3>Invitation Status</h3>
                            <Grid item lg={12}>
                                <List component="nav">
                                    {myInvitations}
                                </List>

                                <Box display="flex" justifyContent="center">
                                    <Pagination
                                        count={this.state.noOfPages}
                                        page={this.state.page}
                                        onChange={this.handleChange}
                                        defaultPage={1}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Box>
                            </Grid>
                        </div>

                    </div>

                </Grid>

            </div>
        );
    }
}

Invitations.propTypes = {
    searchForUsers: PropTypes.func.isRequired,
    fetchCommunities: PropTypes.func.isRequired,
    fetchInvites: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return({
        searched_users_back: state.invitation.searched_users_returned,
        user_communities: state.invitation.my_communities,
        my_sent_invites_local: state.invitation.my_sent_invites
    })
};

export default connect(mapStateToProps,
    {searchForUsers,
        fetchCommunities,
    fetchInvites})(withStyles(useStyles)(Invitations));
