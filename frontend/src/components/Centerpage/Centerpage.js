import React, { Component } from "react";
import "./centerpage.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import {uri} from '../../uri';

class CenterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem("email"),
      owedTransactions: [],
      oweTransactions: [],
      isOpen: false,
      modalEmail: "",
      currency: localStorage.getItem("currency"),
    };
    this.modalEmailHandler = this.modalEmailHandler.bind(this);
  }
  modalEmailHandler = (e) => {
    this.setState({
      modalEmail: e.target.value,
    });
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => {
    const data = {
      id: localStorage.getItem("_id"),
      modalEmail: this.state.modalEmail,
    };
    axios.post(`${uri}/transactions/modal`, data);
    this.setState({ isOpen: false });
    // this.setState({update:true});
    window.location.reload(true);
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  componentDidMount() {
    axios
      .get(`${uri}/transactions/lender/`, {
        params: { email: this.state.email },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          owedTransactions: this.state.owedTransactions.concat(response.data),
        });
      });
    axios
      .get(`${uri}/transactions/borrower/`, {
        params: { email: this.state.email },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          oweTransactions: this.state.oweTransactions.concat(response.data),
        });
      });
  }

  render() {
    let total_amount = 0;
    let you_owe = 0;
    let owed = 0;
    let oweList = [];
    let owedList = [];
    for (let i = 0; i < this.state.owedTransactions.length; i++) {
      total_amount += this.state.owedTransactions[i].amount;
      owed += this.state.owedTransactions[i].amount;
      let obj = {
        name: this.state.owedTransactions[i].borrowerid.name,
        amount: this.state.owedTransactions[i].amount,
        group: this.state.owedTransactions[i].groupid,
      };
      owedList.push(obj);
    }
    for (let i = 0; i < this.state.oweTransactions.length; i++) {
      total_amount -= this.state.oweTransactions[i].amount;
      you_owe += this.state.oweTransactions[i].amount;
      let obj = {
        name: this.state.oweTransactions[i].lenderid.name,
        amount: this.state.oweTransactions[i].amount,
        group: this.state.oweTransactions[i].groupid,
      };
      oweList.push(obj);
    }
    let msg = null;

    let displayowedDetails = owedList.map((transaction) => {
      return (
        <div>
          <label>
            {transaction.name} owes you {this.state.currency}
            {transaction.amount.toFixed(2)} for "{transaction.group}"
          </label>
          <br />
        </div>
      );
    });

    let displayoweDetails = oweList.map((transaction) => {
      return (
        <div class="oweDetails">
          <label>
            You owe {this.state.currency}
            {transaction.amount.toFixed(2)} to {transaction.name} for "{transaction.group}"
          </label>
          <br />
        </div>
      );
    });

    if (oweList.length === 0 && owedList.length === 0) {
      msg = <h6>No Details to be displayed.</h6>;
    }

    return (
      <div className="center">
        <h4>{this.props.page}</h4>&nbsp; &nbsp;&nbsp;
        <Button variant="outline-danger" className="buttons">
          Add an expense
        </Button>
        &nbsp; &nbsp;&nbsp;
        <Button variant="outline-success" onClick={this.openModal}>
          Settle up
        </Button>
        <h5>Summary</h5>
        <ul>
          <label>
            Total balance: {this.state.currency}
            {total_amount.toFixed(2)}
          </label>
        </ul>
        <ul>
          <label>
            You owe: {this.state.currency}
            {you_owe.toFixed(2)}
          </label>
        </ul>
        <ul>
          {" "}
          <label>
            You are owed: {this.state.currency}
            {owed.toFixed(2)}
          </label>
        </ul>
        <h5>Details</h5>
        <div class="details">
          {msg}
          {displayowedDetails}
          {displayoweDetails}
        </div>
        <Modal show={this.state.isOpen} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Settle up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label>With you and :</label>
              <input
                type="text"
                id="modalEmail"
                onChange={this.modalEmailHandler}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.closeModal}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CenterPage;