import React, { Component } from "react";
import axios from "axios";
import "./mygroups.css";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router";
import Head from "../Navbar/Navbar";
import GroupContainer from "./GroupContainer";
import {uri} from '../../uri';
import { acceptInvite, rejectInvite} from "../../actions/inviteAction";
import { connect } from "react-redux";

class MyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      email: localStorage.getItem("email"),
      redirect: null,
      invites: [],
      searchGroup: "",
      update:false
    };
    this.loadGroupPage = this.loadGroupPage.bind(this);
  }

   componentDidMount() {
     axios
      .get(`${uri}/mygroups/`, {
        params: { email: this.state.email },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          groups: this.state.groups.concat(response.data),
        });
      });
      console.log("Groups in fe",this.state.groups);
     axios
      .get(`${uri}/mygroups/invites`, {
        params: { invite_to: this.state.email },
      })
      .then((response) => {
        this.setState({
          invites: this.state.invites.concat(response.data),
        });
      });
  }

  componentDidUpdate(){
    if(this.state.update){
    axios
      .get(`${uri}/mygroups/invites`, {
        params: { invite_to: this.state.email },
      })
      .then((response) => {
        this.setState({
          invites: response.data
        });
      });
      axios
      .get(`${uri}/mygroups/`, {
        params: { email: this.state.email },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          groups: response.data
        });
        this.setState({update:false})
      });
    }
  }
  
  loadGroupPage(e) {
    this.setState({
      redirect: (
        <Redirect
          to={{
            pathname: "/group",
            state: { groupname: e },
          }}
        />
      ),
    });
  }


  dashBoard = () => {
    this.setState({ redirect: <Redirect to="/dashboard" /> });
  };

  accept = (username, groupname) => {
    const data = {
      invite_to: username,
      group: groupname,
    };
    // axios.post(`${uri}/mygroups/acceptInvite`, data);
    // window.location.reload(true);
    // this.componentDidMount();
    this.setState({update:true});
    this.props.acceptInvite(data);
    // this.setState({invites:this.props.user});
    // window.location.reload(true);

  };

  reject = (username, groupname) => {
    const data = { 
      invite_to: username,
      group: groupname,
    };
    this.setState({update:true});
    this.props.rejectInvite(data);
    // axios.post(`${uri}/mygroups/rejectInvite`, data);
    // window.location.reload(true);
  };

  editSearchTerm = (e) => {
    this.setState({ searchGroup: e.target.value });
  };

  dynamicSearch = () => {
    return this.state.groups.filter((group) =>
      group.toLowerCase().includes(this.state.searchGroup.toLowerCase())
    );
  };

  render() {
    const invites = this.state.invites.map((invite) => (
      <div>
        <label>
          {invite.invite_by} has invited you to join "{invite.groupname}"
        </label>
        &nbsp;
        <Button
          variant="outline-success"
          className="inviteButton"
          onClick={() => this.accept(invite.invite_to, invite.groupname)}
        >
          +
        </Button>
        &nbsp;
        <Button
          variant="outline-danger"
          className="inviteButton"
          onClick={() => this.reject(invite.invite_to, invite.groupname)}
        >
          x
        </Button>
      </div>
    ));

    if (!localStorage.getItem("email")) {
      this.setState({ redirect: <Redirect to="/" /> });
    }
    let msg = null;
    if (this.state.groups.length === 0) {
      msg = <h6>You are not part of any group.</h6>;
    }

    return (
      <div>
        {this.state.redirect}
        <Head />
        <div className="expenses">
          <h3>My Groups </h3>{" "}
        </div>
        <div className="mygroups">
          <div>
            <br />
            <div>
              <input
                placeholder={"search group"}
                value={this.state.searchGroup}
                onChange={this.editSearchTerm}
                style={{ width: "275px" }}
              />
              <br />
              <br />
            </div>
            <div>
              {msg}
              <GroupContainer groups={this.dynamicSearch()} />
            </div>
          </div>
          <div className="invites">
            <label>Invites </label> &nbsp; &nbsp;
            {invites}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    invites: state.invites
  };
};
export default connect(mapStateToProps, { acceptInvite, rejectInvite })(MyGroups);
