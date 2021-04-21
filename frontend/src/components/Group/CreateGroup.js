import React, { Component } from "react";
import head from "../Login/logo.png";
import { Button } from "react-bootstrap";
import "./creategroup.css";
import axios from "axios";
import { Redirect } from "react-router";
import Head from "../Navbar/Navbar";
import {uri} from '../../uri';
import PropTypes from "prop-types";
import { createGroup } from "../../actions/groupAction";
import { connect } from "react-redux";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [{ name: "", email: "" }],
      groupname: "",
      image: null,
      errCode: "",
      redirectVar: null,
      users: [],
      suggestions: [],
    };
    this.groupnameHandler = this.groupnameHandler.bind(this);
    this.membersHandler = this.membersHandler.bind(this);
    this.imageHandler = this.imageHandler.bind(this);
    this.createGrp = this.createGrp.bind(this);
  }

  groupnameHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  membersHandler = (e) => {
    this.setState({
      members: e.target.value,
    });
  };

  imageHandler = (e) => {
    this.setState({
      image: e.target.value,
    });
  };

  addClick() {
    this.setState((prevState) => ({
      members: [...prevState.members, { name: "", email: "" }],
    }));
  }

  dashBoard = () => {
    this.setState({ redirectVar: <Redirect to="/dashboard" /> });
  };

  createUI() {
    return this.state.members.map((el, i) => (
      <div>
        <div key={i}>
          <input
            placeholder="Name"
            name="name"
            value={el.name || ""}
            onChange={this.handleChange.bind(this, i)}
          />
          &nbsp; &nbsp;
          <input
            placeholder="Email"
            name="email"
            value={el.email || ""}
            onChange={this.handleChange.bind(this, i)}
          />
        </div>
        <br />
      </div>
    ));
  }

  handleChange(i, e) {
    const { name, value } = e.target;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, "i");
      suggestions = this.state.users.sort().filter((v) => regex.test(v.name));
    }
    let members = [...this.state.members];
    members[i] = { ...members[i], [name]: value };
    this.setState({ members });
    this.setState(() => ({ suggestions }));
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <div>
        {suggestions.map((user) => (
          <ul>
            {user.name} - {user.email}
          </ul>
        ))}
      </div>
    );
  }

  clearSuggestions() {
    this.setState({suggestions:[]});
  }

  componentDidMount() {
    axios.get(`${uri}/group/users`).then((response) => {
      this.setState({
        users: this.state.users.concat(response.data),
      });

    });
  }

  createGrp() {
    if (this.state.groupname === "") {
      this.setState({ errCode: "Group should have a name." });
    } else if (this.state.members.length < 2) {
      console.log("CG here");
      this.setState({ errCode: "Group should have more than two members." });
    } else {
      
      const data = {
        groupname: this.state.groupname,
        members: this.state.members,
        createdBy: localStorage.getItem("email"),
        createdBy_name:localStorage.getItem("name")
      };
      this.props.createGroup(data);
    }
  }

  render() {
    let errMsg = null;
    if(this.props.activities && this.props.activities.message === "Group with the same name already exists."){
      errMsg = (<div class="alert alert-danger" role="alert">
      {this.props.activities.message}
    </div>)
    this.props.activities.message = "";
    }
    
    if (
      this.state.errCode === "Group should have more than two members." ||
      this.state.errCode === "Group should have a name."
    ) {
      errMsg = (
        <div class="alert alert-danger" role="alert">
          {this.state.errCode}
        </div>
      );
    }
    if (this.props.activities && this.props.activities.message === "created group") {
      this.setState({ redirectVar: <Redirect to="/dashboard" /> });
      console.log("Insterd ",this.props.activities.message);
      this.props.activities.message = "";
    }
    return (
      <div>
        {this.state.redirectVar}
        <Head />
        {errMsg}
        <img
          className="loginImage"
          alt="createGrp"
          src={head}
          width="150"
          height="150"
        />
        <br />
        <form class="creategroupform">
          <div class="intro">
            <h6>START A NEW GROUP</h6>
            <br />
            <label>Group Image</label> &nbsp; &nbsp;
            <input
              type="file"
              className="image"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={this.imageHandler}
            />
            <br />
            <br />
            <label class="font-weight-normal">My group shall be called: </label>
            <br />
            <input
              type="text"
              id="groupname"
              onChange={this.groupnameHandler}
              placeholder="Group name"
              data-testid="groupname"
              value={this.state.groupname}
            />
            <br />
            <br />
            <label class="font-weight-normal">GROUP MEMBERS</label>
            <br />
            {this.createUI()}
            {this.renderSuggestions()}
            <Button variant="link" onClick={this.addClick.bind(this)}>
              +Add a person
            </Button>
            <br />
            <button
              type="button"
              class="createGroup"
              onClick={this.createGrp}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

CreateGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  activities: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    activities: state.group.activities
  };
};

export default connect(mapStateToProps, { createGroup })(CreateGroup);