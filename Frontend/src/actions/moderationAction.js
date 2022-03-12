import { MOD_FETCH_COMMUNITIES, MOD_FETCH_SUBS} from "./types";
import axios from "axios";
import { serverURL } from '../utils/config';


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
        let users = {};
        let user_meta = {};
        let bring_together = [];

        for(let entry in data) {
            communities.push({name: data[entry].communityName, requests: data[entry].joinReqs,
                id: data[entry].communityId, subscribers: data[entry].subscribers});

            for(let sub in data[entry].subscribers) {

                if(data[entry].subscribers[sub].id in users) {
                    users[data[entry].subscribers[sub].id].push({name: data[entry].communityName,
                        id: data[entry].communityId});
                }
                else {
                    users[data[entry].subscribers[sub].id] = [{name: data[entry].communityName,
                        id: data[entry].communityId}];
                    user_meta[data[entry].subscribers[sub].id] = {first_name: data[entry].subscribers[sub].firstName,
                    last_name: data[entry].subscribers[sub].lastName,
                        profilePic: data[entry].subscribers[sub].profilePicture};
                }


            }
        }

        for(let x in users) {
            if(x in user_meta) {
                bring_together.push({first_name: user_meta[x].first_name, last_name: user_meta[x].last_name,
                list_communities: users[x], user_id: x, profilePic: user_meta[x].profilePic})
            }
        }

        dispatch({
            type: MOD_FETCH_COMMUNITIES,
            payload: communities
        });

        dispatch({
            type: MOD_FETCH_SUBS,
            payload: bring_together
        });

    }).catch(error => {
        console.log("Got fetchPost error", error);
    });

}