import axios from "axios";
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import cookie from "react-cookies";
import "./mygroups.css";
import { Redirect } from "react-router";
import Head from "../Navbar/Navbar";
import { Dropdown } from "react-bootstrap";
import { uri } from "../../uri";
import PropTypes from "prop-types";
import { addExpense, settleUp } from "../../actions/groupAction";
import { connect } from "react-redux";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.location.state.groupname,
      members: [],
      expenses: [],
      isOpen: false,
      description: "",
      paidmember: localStorage.getItem("email"),
      amount: "",
      date: null,
      redirectVar: null,
      groupBalance: [],
      message: "",
      updateOpen: false,
      username: "",
      email: "",
      currency: localStorage.getItem("currency"),
      updateName: "",
      updateGroupName: false,
      groupBorrowed: [],
      update: false,
      showForm: false,
      note: "",
      comments: [],
      expenseOpened:"",
      updateBalance:false,
      updateNotes:""
    };
    this.descriptionHandler = this.descriptionHandler.bind(this);
    this.amountHandler = this.amountHandler.bind(this);
    this.landingPage = this.landingPage.bind(this);
  }

  descriptionHandler = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  nameChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  groupNameChange = (e) => {
    this.setState({
      updateName: e.target.value,
    });
  };

  noteChange = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  emailHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  amountHandler = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  dateHandler = (e) => {
    this.setState({
      date: e.target.value,
    });
  };
  handleChange = (e) => {
    this.setState({
      paidmember: e.target.value,
    });
  };
  async componentDidMount() {
    await axios
      .get(`${uri}/group/expenses`, {
        params: { name: this.state.name },
      })
      .then((response) => {
        // update the state with the response data
        this.setState({
          expenses: this.state.expenses.concat(response.data),
        });
      });
    await axios
      .get(`${uri}/group/members`, {
        params: { name: this.state.name },
      })
      .then((response) => {
        this.setState({
          members: this.state.members.concat(response.data),
        });
      });
    await axios
      .get(`${uri}/group/balance`, {
        params: { groupname: this.state.name, members: this.state.members },
      })
      .then((response) => {
        this.setState({
          groupBalance: this.state.members.concat(response.data)
        });
      });
  }

  async componentDidUpdate() {
    if (this.state.update) {
     await axios
        .get(`${uri}/group/expenses`, {
          params: { name: this.state.name },
        })
        .then((response) => {
          // update the state with the response data
          this.setState({
            expenses: response.data,
          });
        });
        this.setState({update:false});
      }
        if (this.state.updateBalance) {
       await  axios
      .get(`${uri}/group/balance`, {
        params: { groupname: this.state.name, members: this.state.members },
      })
      .then((response) => {
        this.setState({
          groupBalance: response.data
        });
      });
        this.setState({updateBalance:false});
    }

    if(this.state.updateNotes.length!==0){
      axios
      .get(`${uri}/group/note`, {
        params: { expense: this.state.updateNotes},
      })
      .then((response) => {
        this.setState({
          comments: response.data,
        });
        this.setState({updateNotes:""});
    });
  }
      }

  openModal = () => this.setState({ isOpen: true });
  updateOpen = () => this.setState({ updateOpen: true });
  updateGroupName = () => this.setState({ updateGroupName: true });
  closeModal = () => {
    const data = {
      description: this.state.description,
      paid_by: this.state.paidmember,
      groupname: this.state.name,
      amount: this.state.amount,
      date: this.state.date,
      email: localStorage.getItem("email"),
      members: this.state.members,
    };
    this.props.addExpense(data);
    this.setState({ update: true });
    this.setState({updateBalance:true})
    this.setState({ isOpen: false });
  };
  
  addUser = () => {
    const data = {
      groupname: this.state.name,
      email: this.state.email,
      invitedby: localStorage.getItem("email"),
    };
    axios.post(`${uri}/group/addUserToGroup`, data);

    this.setState({ isOpen: false });
    // window.location.reload(true);
  };

  updateGrpName = () => {
    const data = {
      groupname: this.state.name,
      updateName: this.state.updateName,
    };
    axios.put(`${uri}/group/updateGroupName`, data);

    this.setState({ updateGroupName: false });
    window.location.reload();
  };

  close = () => {
    this.setState({ isOpen: false });
  };
  updateClose = () => {
    this.setState({ updateOpen: false });
  };
  updateGroupNameClose = () => {
    this.setState({ updateGroupName: false });
  };
  addNote = () => {
    this.setState({ showForm: false });
  };
  landingPage = () => {
    this.setState({ redirectVar: <Redirect to="/" /> });
    cookie.remove("cookie");
  };

  dashBoard = () => {
    this.setState({ redirectVar: <Redirect to="/dashboard" /> });
  };

  settleUp = () => {
    const data = {
      name: localStorage.getItem('email'),
      groupname: this.state.name,
    };
    this.props.settleUp(data);
    // axios.post(`${uri}/transactions/settleup`, data).then((response) => {
      // console.log("Update Settle up ",this.props.activities);
      // if (this.props.activities === "Balance settled") {
        this.setState({updateBalance:true});
      // }
    // });
  };

  leaveGroup = () => {
    const data = {
      name: localStorage.getItem("email"),
      groupname: this.state.name,
      id:localStorage.getItem("_id")
    };
    axios.post(`${uri}/group/leaveGroup`, data).then((response) => {
      this.setState({
        message: response.data,
      });
    });
  };

  updateGroup = () => {
    this.setState({
      redirectVar: (
        <Redirect
          to={{
            pathname: "/updategroup",
            state: { groupname: this.state.name },
          }}
        />
      ),
    });
  };

  openNote = (expense) => {
    axios
      .get(`${uri}/group/note`, {
        params: { expense: expense._id },
      })
      .then((response) => {
        this.setState({
          comments: response.data,
        });
        console.log("Comments ", this.state.comments);
        localStorage.setItem("expenseid", expense._id);
      });
    this.setState({ showForm: true });
  };

  addComment = () => {
    console.log("Note Length",this.state.note.length);
    if (this.state.note.length > 0) {
      const data = {
        expense: localStorage.getItem("expenseid"),
        user: localStorage.getItem("_id"),
        comment: this.state.note,
      };
      axios.post(`${uri}/group/note`, data);
      this.setState({updateNotes: localStorage.getItem("expenseid")});
    }
  };

  removeComment = (comment) => {
    const data = {
      note: comment._id,
    };
    this.setState({updateNotes:comment.expense});
    axios.post(`${uri}/group/deleteNote`, data);
  }
  
  render() {
    let errMsg = null;
    if (!localStorage.getItem("email")) {
      this.setState({ redirectVar: <Redirect to="/" /> });
    }
    if (this.state.message === "Exited from group") {
      this.setState({ redirectVar: <Redirect to="/mygroups" /> });
    }
    if (
      this.state.message ===
      "Please clear your dues and leave the group after recieving the amount you are owed."
    ) {
      errMsg = (
        <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>
      );
    } else if (
      this.state.message === "Please clear your dues to leave the group."
    ) {
      errMsg = (
        <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>
      );
    }

    let expenses = this.state.expenses.map((expense) => (
      <div className="expenseDesc">
        <Button variant="light" onClick={() => this.openNote(expense)}>
          {expense.description}
        </Button>
        &nbsp; {expense.paid_by.name} &nbsp;{this.state.currency}
        {expense.amount}
        <div className="date">{expense.date.split("T")[0]} &nbsp;</div>
        <br />
      </div>
    ));

    if (expenses.length === 0) {
      expenses = <h4>No expenses to show.</h4>;
    }

    let balance = [];
    for (let i = 0; i < this.state.groupBalance.length; i++) {
      if (
        this.state.groupBalance[i].balance !== null &&
        this.state.groupBalance[i].balance !== 0
      ) {
        if (this.state.groupBalance[i].balance > 0) {
          balance.push(
            <h6>
              {this.state.groupBalance[i].email} gets back {this.state.currency}
              {this.state.groupBalance[i].balance}
            </h6>
          );
        }
        if (this.state.groupBalance[i].balance < 0) {
          let temp = Math.abs(this.state.groupBalance[i].balance);
          balance.push(
            <h6>
              {this.state.groupBalance[i].email} owes {this.state.currency}
              {temp}
            </h6>
          );
        }
      }
    }
    if (balance.length === 0) {
      balance.push(<h6>No pending payments in this group.</h6>);
    }

    let comments = [];
    for (let i = 0; i < this.state.comments.length; i++) {
      if(this.state.comments[i].user.email === localStorage.getItem("email")){
      comments.push(
        <div className="noteDesc">
           <ol> {this.state.comments[i].note} {" "} <Button
            variant="link"
            onClick={() => {if (window.confirm('Are you sure you want to delete this comment?')) this.removeComment(this.state.comments[i])}}
          >
            x
          </Button> <br/>
            <div className="noteUser">{this.state.comments[i].user.name}
            </div>
            <br/>
            </ol>
        </div>
      );
      }
      else{
        comments.push(
          <div className="noteDesc">
             <ol> {this.state.comments[i].note}
              <div className="noteUser">{this.state.comments[i].user.name}
              </div>
              <br/>
              </ol>
          </div>
        )
      }
    }

    return (
      <div class="addexpense">
        {this.state.redirectVar}
        <Head />
        {errMsg}
        <div className="head">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-basic"
              size="lg"
            >
              {this.state.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={this.updateGroupName}>
                Update Group Name
              </Dropdown.Item>
              <Dropdown.Item onClick={this.updateOpen}>
                Add a user
              </Dropdown.Item>
              <Dropdown.Item onClick={this.leaveGroup}>
                Leave Group
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <br />
        </div>
        <Modal show={this.state.isOpen} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add an expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label>With you and All of {this.state.name}</label>
              <br />
              <input
                type="text"
                id="description"
                onChange={this.descriptionHandler}
                placeholder="Enter a description"
                required
              />
              <br />
              <br />
              <label>{this.state.currency}</label>
              <input
                type="text"
                id="amount"
                onChange={this.amountHandler}
                placeholder="0.00"
                required
              />
              <br />
              <br />
              <label>Paid By </label>
              <br />
              <select
                onChange={this.handleChange}
                value={this.state.paidmember}
                id="paidmember"
              >
                {this.state.members.map((member) => {
                  return <option value={member.email}> {member.email.split("@")[0]} </option>;
                })}
              </select>
              <br />
              <br />
              <label>Date:</label> <br />
              <input
                type="date"
                id="date"
                onChange={this.dateHandler}
                required
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.closeModal}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.updateOpen} onHide={this.updateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <input
                type="text"
                id="username"
                onChange={this.nameChange}
                placeholder="Name"
                required
              />
              <br />
              <br />
              <input
                type="email"
                id="email"
                onChange={this.emailHandler}
                placeholder="Email"
                required
              />
              <br />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.addUser}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.updateGroupName}
          onHide={this.updateGroupNameClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <input
                type="text"
                id="groupname"
                onChange={this.groupNameChange}
                placeholder="Group Name"
                required
              />
              <br />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.updateGrpName}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showForm} onHide={this.addNote}>
          <Modal.Header closeButton>
            <Modal.Title>Notes And Comments</Modal.Title>
          </Modal.Header>
          {comments}
          <Modal.Body>
            <textarea
              rows="3"
              cols="30"
              id="note"
              name="note"
              onChange={this.noteChange}
              placeholder="Add a comment"
            ></textarea>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.addComment}>
              Post
            </Button>
          </Modal.Footer>
        </Modal>
        <div class="group">
          <div className="expenses">
            <h3>Expenses </h3>
            <br />
            <br />
            {expenses}
            <br /> <br />
            <br />
            <Button variant="outline-danger" onClick={this.openModal}>
              Add an expense
            </Button>{" "}
            <Button variant="outline-success" onClick={this.settleUp}>
              Settle up
            </Button>{" "}
          </div>
          <div className="groupBalance">
            <label>Group Balance</label>
            {balance}
          </div>
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  addExpense: PropTypes.func.isRequired,
  activities: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    activities: state.group.activities
  };
};

export default connect(mapStateToProps, { addExpense, settleUp })(Group);
