import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import CreateGroup from "./components/Group/CreateGroup";
import MyGroups from "./components/Group/MyGroups";
import Group from "./components/Group/Group";
import Profile from "./components/Profile/Profile";
import Activity from "./components/RecentActivities/RecentActivities";
//Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Route exact path="/" component={Landing} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/creategroup" component={CreateGroup} />
        <Route exact path="/mygroups" component={MyGroups} />
        <Route exact path="/group" component={Group} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/activity" component={Activity} />
      </div>
    );
  }
}

export default Main;
