import { Switch, Route } from "react-router-dom";

import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Landing from "./components/Landing/Landing";
import Main from "./components/Main/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store/store";
import { Provider } from "react-redux";
import Messages from "./components/Messages/Messages";
import MyProfile from "./components/Profile/MyProfile/MyProfile";
import EditProfile from "./components/Profile/MyProfile/EditProfile";
import UserProfile from "./components/Profile/UserProfile/UserProfile";
import CommunityAnalytics from "./components/CommunityAnalytics/CommunityAnalytics";

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Switch>
          <Route path="/signup" exact>
            <SignUp />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          {/* hanish */}
          {/* <Route path="/myprofile" exact>
            <MyProfile />
          </Route> */}
          <Route path="/editprofile" exact>
            <EditProfile />
          </Route>
          {/* <Route path="/userprofile" exact>
            <UserProfile />
          </Route> */}
          {/* hanish */}
          <Route path="/" exact>
            <Landing />
          </Route>
          <Main />
        </Switch>
      </div>
    </Provider>
  );
}

export default App;
