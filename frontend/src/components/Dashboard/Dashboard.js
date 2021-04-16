import React, { Component } from "react";
import { Dropdown, Navbar, Nav } from "react-bootstrap";
import head from "./logo.png";
import { Redirect } from "react-router";
import { userLogout } from "../../actions/loginAction";
import Centerpage from "../Centerpage/Centerpage";
import { connect } from "react-redux";
import "./dashboard.css";
import cookie from "react-cookies";

class Dashboard extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      redirectVar: null,
      email: localStorage.getItem("email"),
      user: localStorage.getItem("name"),
    };
    this.landingPage = this.landingPage.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.activity = this.activity.bind(this);
    this.profile = this.profile.bind(this);
    this.mygroups = this.mygroups.bind(this);
  }

  landingPage = () => {
    this.props.userLogout();
    window.localStorage.clear();
    cookie.remove("cookie");
    this.setState({ redirectVar: <Redirect to="/" /> });
  };

  createGroup = () => {
    this.setState({ redirectVar: <Redirect to="/creategroup" /> });
  };

  profile = () => {
    this.setState({ redirectVar: <Redirect to="/profile" /> });
  };

  activity = () => {
    this.setState({ redirectVar: <Redirect to="/activity" /> });
  };

  mygroups = () => {
    this.setState({ redirectVar: <Redirect to="/mygroups" /> });
  };

  render() {
    if (!localStorage.getItem("email")) {
      this.setState({ redirectVar: <Redirect to="/" /> });
    }

    return (
      <div>
        {this.state.redirectVar}
        <Navbar bg="light" variant="light">
          <Nav className="container-fluid">
            <img
              alt=""
              src={head}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />
            <div className="wise">Splitwise</div>
            <div className="dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                  Manage Groups
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.createGroup}>
                    Create Group
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.mygroups}>
                    My Groups
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              &nbsp;
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Hi, {this.state.user}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.landingPage}>
                    Logout
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.activity}>
                    Activity
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.profile}>Profile</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Nav>
        </Navbar>
        <div className="dashboard">
          <Centerpage page={"Dashboard"} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (response) => ({ response });

export default connect(mapStateToProps, { userLogout })(Dashboard);
