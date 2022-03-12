import {DASH_FETCH_POSTS} from '../actions/types';

const initialState = {
    all_posts: []
};

export default function (state = initialState, action) {

    switch(action.type) {
        case DASH_FETCH_POSTS:
            return {
                ...state,
                all_posts: action.payload
            };
        default:
            return state;
    }
};