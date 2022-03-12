import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Box} from "@material-ui/core"
import {CommunityCard, UserCard} from "./CreatedCommunities";
import Pagination from "@material-ui/lab/Pagination";

import {connect} from "react-redux";
import {fetchCommunities} from "../../actions/moderationAction";


const useStyles = theme => ({
    root: {
        width: '100%',
        minWidth: 500,
        backgroundColor: ["white"]
    },
});

class Moderation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myCommunities: [],
            itemsPerPage: 3,
            page: 1,
            page_sub: 1,
            noOfPages: null,
            noOfPagesSub: null,
            with_filter: false,
            with_filter_sub: false,
            filtered_communities: [],
            subscribers: [],
            filtered_subscribers: []
        }

    }

    filterCommunities = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
            this.setState({
                with_filter: false,
                filtered_communities: []
            })
        } else if (this.state.myCommunities !== []) {
            let tempCommunities = [];

            for (let entry in this.state.myCommunities) {
                if (this.state.myCommunities[entry]['name'].toLowerCase().includes(e.target.value.toLowerCase())) {
                    tempCommunities.push(this.state.myCommunities[entry]);
                }
            }

            this.setState({
                filtered_communities: tempCommunities,
                with_filter: true
            })
        }

    }

    filterSubscribers = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
            this.setState({
                with_filter_sub: false,
                filtered_subscribers: []
            })
        } else if (this.state.subscribers !== []) {
            let tempSubscribers = [];

            for (let entry in this.state.subscribers) {
                if (this.state.subscribers[entry]['first_name'].toLowerCase().includes(e.target.value.toLowerCase()) ||
                    this.state.subscribers[entry]['last_name'].toLowerCase().includes(e.target.value.toLowerCase())) {
                    tempSubscribers.push(this.state.subscribers[entry]);
                }
            }

            this.setState({
                filtered_subscribers: tempSubscribers,
                with_filter_sub: true
            })
        }

    }

    handleChange = (event,value) => {
        event.preventDefault();
        this.setState({
            page: value
        });
    }

    handleChangeSub = (event,value) => {
        event.preventDefault();
        this.setState({
            page_sub: value
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.requests_for_user !== this.props.requests_for_user) {
            this.setState({
                myCommunities: this.props.requests_for_user,
                noOfPages: Math.ceil(this.props.requests_for_user.length / this.state.itemsPerPage)
            });
        }
        if(prevProps.my_subscribers !== this.props.my_subscribers) {
            this.setState({
                subscribers: this.props.my_subscribers,
                noOfPagesSub: Math.ceil(this.props.my_subscribers.length / this.state.itemsPerPage)
            });
        }

    }


    componentDidMount() {
        // Fetch all my community info
        this.props.fetchCommunities();
        //Then calculate and set the number of pages needed for pagination
        this.setState({
            noOfPages: Math.ceil(this.state.myCommunities.length / this.state.itemsPerPage)
        })
    }

    render() {

        let communities_current;
        if(this.state.with_filter) {
            communities_current = this.state.filtered_communities;
        }
        else {
            communities_current = this.state.myCommunities;
        }

        let allRequests;

        if(communities_current.length === 0) {
            allRequests = (
                <ListItem>
                    <h4>You do not own any communities</h4>
                </ListItem>
            )
        }
        else {
            allRequests = communities_current.slice((this.state.page - 1) * this.state.itemsPerPage,
                this.state.page * this.state.itemsPerPage).map( entry => {

                return (
                    <ListItem>
                        <CommunityCard community={entry.name} requests={entry.requests} communityID={entry.id}
                                       subscribers={entry.subscribers} oncommit={this.props.fetchCommunities}/>
                    </ListItem>
                )
            })
        }

        let subscribers_current;
        if(this.state.with_filter_sub) {
            subscribers_current = this.state.filtered_subscribers;
        }
        else {
            subscribers_current = this.state.subscribers;
        }

        const allSubscribers = subscribers_current.slice((this.state.page_sub - 1) * this.state.itemsPerPage,
            this.state.page_sub * this.state.itemsPerPage).map( entry => {

            return (
                <ListItem>
                    <UserCard userID={entry.user_id} communities={entry.list_communities} firstName={entry.first_name}
                             lastName={entry.last_name} profilePicture={entry.profilePic} oncommit={this.props.fetchCommunities}/>
                </ListItem>
            )
        })

        const {classes} = this.props;


        return (
            <div className={classes.root}>



                <Grid container direction='row' justify="center" spacing={2}>
                    <div style={{display: "flex", border: '1px solid blue', width: 900, marginTop: 20}}>

                        <div style={{padding: 40}}>
                            <h3>My Communities</h3>
                            <Grid item lg={12}>
                                <List component="nav">
                                    {allRequests}
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

                        <div style={{paddingTop: 40}}>
                            <Grid item lg={4}>
                                <input style={{borderRadius: 4}} onChange={this.filterCommunities}
                                       type="text" name="filtercommunities"
                                       placeholder="Search Communities"/>
                            </Grid>
                        </div>

                    </div>

                </Grid>

                <Grid container direction='row' justify="center" spacing={2}>

                    <div style={{display: "flex", border: '1px solid blue', width: 900, marginTop: 20}}>

                        <div style={{padding: 40}}>
                            <h3>Users in my Communities</h3>
                            <Grid item lg={12}>
                                <List component="nav">
                                    {allSubscribers}
                                </List>

                                <Box display="flex" justifyContent="center">
                                    <Pagination
                                        count={this.state.noOfPagesSub}
                                        page={this.state.page_sub}
                                        onChange={this.handleChangeSub}
                                        defaultPage={1}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Box>
                            </Grid>
                        </div>

                        <div style={{paddingTop: 40}}>
                            <Grid item lg={4}>
                                <input style={{borderRadius: 4}} onChange={this.filterSubscribers}
                                       type="text" name="filtersubscribers"
                                       placeholder="Search Subscribers"/>
                            </Grid>
                        </div>

                    </div>

                </Grid>
            </div>
        );
    }

}


Moderation.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchCommunities: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return ({
        requests_for_user: state.moderation.communities,
        my_subscribers: state.moderation.all_subs
    })
};


export default connect(mapStateToProps, {fetchCommunities})(withStyles(useStyles)(Moderation));