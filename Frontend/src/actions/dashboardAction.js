import {DASH_FETCH_POSTS} from "./types";
import axios from 'axios';
import { serverURL } from '../utils/config';

export const fetchPosts = () => dispatch => {

    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: request_token
        }
    }

    axios.get(`${serverURL}/api/dashboard/`,config).then(response => {
        // Do some data processing here
        let all_posts = [];

        const data = response.data[0];

        for(let entry in data) {

            data[entry].map(post => {
                let post_root_comments = [];
                for(let item in post.post) {
                    if(item.includes("cv_")) {
                        post_root_comments.push({comment_id: parseInt(item.split("_")[1]),
                        upvotes: post.post[item].upvotes, downvotes: post.post[item].downvotes,
                            userVoted: post.post[item].userVoted});
                    }
                }
                let down, up, yesVote, noVote;
                if(post.post.postVotes.userVoted === 1) {
                    up = post.post.postVotes.upvotes - 1;
                    down = post.post.postVotes.downvotes;
                    yesVote = true;
                    noVote = false
                }
                else if(post.post.postVotes.userVoted === 0) {
                    up = post.post.postVotes.upvotes;
                    down = post.post.postVotes.downvotes - 1;
                    yesVote = false;
                    noVote = true;
                }

                else {
                    up = post.post.postVotes.upvotes;
                    down = post.post.postVotes.downvotes;
                    yesVote = false;
                    noVote = false
                }

            all_posts.push({title: post.post.title, dateCreated : post.post.date, creator: post.post.creatorName,
            community: entry, type: post.post.type, text: post.post.content ? post.post.content : "", image: post.post.image,
            upVoteCount: up, downVoteCount: down, id: post.post.id,
                comments: post.post.comments ? post.post.comments : [], voteYes: yesVote, voteNo: noVote,
                root_comments: post_root_comments});
            })
        }

        dispatch({
            type: DASH_FETCH_POSTS,
            payload: all_posts
        });

    }).catch(error => {
        console.log("Got fetchPost error", error);
    });
}