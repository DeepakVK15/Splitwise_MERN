import React, { Component } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import head from "./logo.png";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { userLogout } from "../../actions/loginAction";
import { connect } from "react-redux";

class Heading extends Component {
  state = {
    redirectVar: null,
  };

  landingPage = () => {
    this.props.userLogout();
    window.localStorage.clear();
    cookie.remove("cookie");
    this.setState({ redirectVar: <Redirect to="/" /> });
  };

  dashBoard = () => {
    this.setState({ redirectVar: <Redirect to="/dashboard" /> });
  };

  render() {
    if (!localStorage.getItem("email")) {
      console.log("Email ",localStorage.getItem("email"));
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
            <div className="split">Splitwise</div>
            <Nav.Item className="ml-auto">
              <Button variant="light" onClick={this.dashBoard}>
                Dashboard
              </Button>
              <Button variant="success" onClick={this.landingPage}>
                Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (response) => ({ response });

export default connect(mapStateToProps, { userLogout })(Heading);