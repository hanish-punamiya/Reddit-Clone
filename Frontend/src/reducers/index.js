import {combineReducers} from "redux";
import dashboardReducer from "./dashboardReducer";
import moderationReducer from "./moderationReducer";
import invitationReducer from "./invitationReducer";

export default combineReducers({
    // Add reducers here
    dashboard: dashboardReducer,
    moderation: moderationReducer,
    invitation: invitationReducer
});