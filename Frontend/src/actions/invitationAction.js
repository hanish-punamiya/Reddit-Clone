import {INVITE_GET_USERS, INVITE_FETCH_COMMUNITIES, INVITE_FETCH_INVITES, INVITE_FETCH_RECEIVED_INVITES} from "./types";
import axios from 'axios';
import { serverURL } from '../utils/config';

export const searchForUsers = (name_string) => dispatch => {

    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: request_token
        }
    }
    const data = {
        userName: name_string
    }

    axios.post(`${serverURL}/api/message/find`,data, config).then(response => {
        // Do some data processing here
        const data = response.data;
        let return_array = [];

        for(let entry in data) {
                return_array.push({firstName: data[entry].firstName, lastName: data[entry].lastName,
                    email: data[entry].email, id: data[entry].id});
        }

        dispatch({
            type: INVITE_GET_USERS,
            payload: return_array
        });

    }).catch(error => {
        console.log("Got searchForUsers error", error);
    });

}

export const fetchCommunities = () => dispatch => {
    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: request_token
        }
    }

    axios.get(`${serverURL}/api/moderator/`,config).then(response => {
        // Do some data processing here

        const data = response.data;
        let communities = [];

        for(let entry in data) {
            communities.push({name: data[entry].communityName,
                id: data[entry].communityId});
        }

        dispatch({
            type: INVITE_FETCH_COMMUNITIES,
            payload: communities
        });

    }).catch(error => {
        console.log("Got fetch my communities error", error);
    });

}

export const fetchInvites = () => dispatch => {
    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: request_token
        }
    }

    axios.get(`${serverURL}/api/moderator/`,config).then( async response => {
        // Do some data processing here

        const data = response.data;
        let invites = [];

        for(let entry in data) {

            let inner_config = {
                headers: {
                    Authorization: request_token
                }
            }
            let id = data[entry].communityId.toString();


            axios.defaults.headers.common['Authorization'] = request_token // for all requests
           await axios.get(`${serverURL}/api/invite/communityInvites/${id}`, inner_config).then(response => {

                let in_data = response.data;

                for(let user in in_data) {

                    if(in_data[user].userId !== null) {
                        invites.push({community: data[entry].communityName,
                            firstName: in_data[user].userId.firstName,
                            lastName: in_data[user].userId.lastName, time: in_data[user].date});
                    }
                }

            }).catch(error => {
                console.log("Got fetch community invites error", error);
            });
        }

        dispatch({
            type: INVITE_FETCH_INVITES,
            payload: invites
        });

    }).catch(error => {
        console.log("Got fetch my sent invites error", error);
    });

}


export const fetchReceivedInvites = () => dispatch => {
    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: request_token
        }
    }

    axios.get(`${serverURL}/api/invite/userInvites`,config).then( async response => {
        // Do some data processing here
        const data = response.data;
        let invites = []
        for(let entry in data) {
            invites.push({communityName: data[entry].communityId.communityName
                , communityId: data[entry].communityId.id});
        }

        dispatch({
            type: INVITE_FETCH_RECEIVED_INVITES,
            payload: invites
        });

    }).catch(error => {
        console.log("Got fetch my received invites error", error);
    });

}