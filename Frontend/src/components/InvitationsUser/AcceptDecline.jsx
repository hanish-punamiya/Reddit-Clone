import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import {InviteCard} from "./InviteCard";
import {fetchReceivedInvites} from "../../actions/invitationAction";

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


class InvitationsAcceptDecline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sent_invites: []
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevProps.my_received_invites_local !== this.props.my_received_invites_local) {
            this.setState({
                sent_invites: this.props.my_received_invites_local
            });
        }

    }
    componentDidMount() {
        // Fetch all invites I've received
        this.props.fetchReceivedInvites();
    }


    render() {
        const {classes} = this.props;

        let myInvitations;

        if(this.state.sent_invites.length === 0) {
            myInvitations = (
                <ListItem>
                    <h5>Currently no invites</h5>
                </ListItem>
            )
        }
        else {
            myInvitations = this.state.sent_invites.map( entry => {
                return (
                    <ListItem>
                        <InviteCard community_name={entry.communityName}
                                    communityID={entry.communityId} returnFunct={this.props.fetchReceivedInvites}/>
                    </ListItem>
                )
            })
        }

        return (
            <div className={classes.root}>

                <Grid container direction='row' justify="center" spacing={2}>

                    <div style={{display: "flex", justifyContent: 'center', border: '1px solid blue', width: 900, marginTop: 20}}>

                        <div style={{padding: 40}}>
                            <h3>My Invites</h3>
                            <Grid item lg={12}>
                                <List component="nav">
                                    {myInvitations}
                                </List>
                            </Grid>
                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

InvitationsAcceptDecline.propTypes = {
    fetchReceivedInvites: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return({
        my_received_invites_local: state.invitation.my_received_invites
    })
};

export default connect(mapStateToProps, {fetchReceivedInvites})
(withStyles(useStyles)(InvitationsAcceptDecline));
