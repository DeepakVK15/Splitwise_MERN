import axios from "axios";
import React, { Component } from "react";
import cookie from "react-cookies";
import "./activities.css";
import Head from "../Navbar/Navbar";
import { Redirect } from "react-router-dom";
import { uri } from "../../uri";
import ReactPaginate from "react-paginate";

class RecentActivities extends Component {
  state = {
    activities: [],
    groups: [],
    group: "",
    order: "asc",
    redirectVar: "",
    activitiesPerPage:2,
    pageNumber:0
  };

  async componentDidMount() {
    await axios
      .get(`${uri}/activities/`, {
        params: { email: localStorage.getItem("email") },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          activities: this.state.activities.concat(response.data),
        });
      });
    console.log("logginggg ", this.state.activities);
    await axios
      .get(`${uri}/mygroups/`, {
        params: { email: localStorage.getItem("email") },
      })
      .then((response) => {
        //update the state with the response data
        this.setState({
          groups: this.state.groups.concat(response.data),
        });
      });
  }

  handleChange = (e) => {
    this.setState({
      group: e.target.value,
    });
  };

  orderChange = (e) => {
    this.setState({
      order: e.target.value,
    });
  };

  pageSizeChange = (e) => {
    this.setState({
      activitiesPerPage:e.target.value
    });
    this.setState({pageNumber:0});
  };

  render() {
    
    if (!cookie.load("cookie")) {
      this.setState({ redirectVar: <Redirect to="/" /> });
    }
    let activities = [];
    if (this.state.activities.length === 0) {
      activities.push(
        <div>
          <br />
          No recent activity to show.
        </div>
      );
    }
    
    if (this.state.order === "desc") {
      this.state.activities.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
      });
    } else if (this.state.order === "asc") {
      this.state.activities.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });
    }

    for (let i = 0; i < this.state.activities.length; i++) {
      if (this.state.activities[i].user === localStorage.getItem("email")) {
        this.state.activities[i].name = "You";
      }
      if (this.state.group === "") {
        if (this.state.activities[i].operation === "added") {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} added the expense &nbsp;"
              {this.state.activities[i].description}" in "
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]} &nbsp;
              </div>
              <br />
            </div>
          );
        } else if (this.state.activities[i].operation === "created") {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} created the group &nbsp; "
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]} &nbsp;
              </div>
              <br />
            </div>
          );
        } else if (this.state.activities[i].operation === "settled up") {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} settled the balance in
              &nbsp;"
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]}
              </div>
              <br />
            </div>
          );
        }
      } else {
        if (
          this.state.activities[i].operation === "added" &&
          this.state.activities[i].groupname === this.state.group
        ) {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} added the expense &nbsp;"
              {this.state.activities[i].description}" in "
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]} &nbsp;
              </div>
              <br />
            </div>
          );
        } else if (
          this.state.activities[i].operation === "created" &&
          this.state.activities[i].groupname === this.state.group
        ) {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} created the group &nbsp; "
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]} &nbsp;
              </div>
              <br />
            </div>
          );
        } else if (
          this.state.activities[i].operation === "updated" &&
          this.state.activities[i].groupname === this.state.group
        ) {
          activities.push(
            <div className="activity">
              {this.state.activities[i].user.name} updated the group &nbsp; "
              {this.state.activities[i].groupname}"
              <div className="date">
                {this.state.activities[i].date.split("T")[0]}
              </div>
              <br />
            </div>
          );
        }
      }
    }
    let pagesVisited = this.state.pageNumber * this.state.activitiesPerPage;
    console.log("Page Visited", pagesVisited);
    const changePage = ({ selected }) => {
      this.setState({pageNumber:selected});
    };
    return (
      <div>
        {this.state.redirectVar}
        <Head />
        <div className="activities" key="keys">
          <h4>Recent activity</h4>
          <br />
          <br />
          <select
            onChange={this.handleChange}
            value={this.state.group}
            id="group"
            key="group"
          >
            <option defaultValue value="" key="default">
              Select a group...
            </option>
            {this.state.groups.map((group) => {
              return (
                <option value={group} key={group}>
                  {" "}
                  {group}{" "}
                </option>
              );
            })}
          </select>
          &nbsp; &nbsp;
          <select
            onChange={this.orderChange}
            value={this.state.order}
            id="order"
            key="order"
          >
            <option value="initial" defaultValue key="initial">
              Sort By Date
            </option>
            <option value="asc" key="asc">
              Recent first
            </option>
            <option value="desc" key="desc">
              Recent last
            </option>
          </select>
          &nbsp; &nbsp;
          <select
            onChange={this.pageSizeChange}
            value={this.state.activitiesPerPage}
            id="activitiesPerPage"
            key="activitiesPerPage"
          >
            <option value="2" defaultValue key="2">
             2
            </option>
            <option value="5" key="5">
              5
            </option>
            <option value="10" key="10">
              10
            </option>
          </select>
          <br/>
          <br />
          {activities.slice(pagesVisited, pagesVisited+this.state.activitiesPerPage)}
          <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(this.state.activities.length/this.state.activitiesPerPage)}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
        </div>
      </div>
    );
  }
}

export default RecentActivities;
