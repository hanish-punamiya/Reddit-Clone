import {MOD_FETCH_COMMUNITIES, MOD_FETCH_SUBS} from '../actions/types';

const initialState = {
    communities: [],
    all_subs: []
};

export default function (state = initialState, action) {

    switch(action.type) {
        case MOD_FETCH_COMMUNITIES:
            return {
                ...state,
                communities: action.payload
            };
        case MOD_FETCH_SUBS:
            return {
                ...state,
                all_subs: action.payload
            };
        default:
            return state;
    }
};