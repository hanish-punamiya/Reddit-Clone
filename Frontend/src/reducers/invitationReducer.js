import {INVITE_GET_USERS, INVITE_FETCH_COMMUNITIES, INVITE_FETCH_INVITES, INVITE_FETCH_RECEIVED_INVITES} from '../actions/types';

const initialState = {
    searched_users_returned: [],
    my_communities: [],
    my_sent_invites: [],
    my_received_invites: []
};

export default function (state = initialState, action) {

    switch(action.type) {
        case INVITE_GET_USERS:
            return {
                ...state,
                searched_users_returned: action.payload
            };
        case INVITE_FETCH_COMMUNITIES:
            return {
                ...state,
                my_communities: action.payload
            };
        case INVITE_FETCH_INVITES:
            return {
                ...state,
                my_sent_invites: action.payload
            };
        case INVITE_FETCH_RECEIVED_INVITES:
            return {
                ...state,
                my_received_invites: action.payload
            };
        default:
            return state;
    }
};