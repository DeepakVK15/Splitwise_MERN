import { CREATE_GROUP, ADD_EXPENSE, SETTLE_UP } from "./types";
import axios from "axios";
import { uri } from "../uri";

export const createGroup = (data) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .post(`${uri}/group/creategroup`, data)
    .then((response) =>
      dispatch({
        type: CREATE_GROUP,
        payload: response.data,
      })
    )
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: CREATE_GROUP,
          payload: error.response.data,
        });
      }
      return;
    });
};

export const addExpense = (data) => (dispatch) => {
axios.defaults.withCredentials = true;
  axios
    .post(`${uri}/group/addExpense`, data)
    .then((response) =>
      dispatch({
        type: ADD_EXPENSE,
        payload: response.data,
      })
    )
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: ADD_EXPENSE,
          payload: error.response.data,
        });
      }
      return;
    });
};

export const settleUp = (data) => (dispatch) => {
  axios.defaults.withCredentials = true;
    axios
      .post(`${uri}/transactions/settleUp`, data)
      .then((response) =>
        dispatch({
          type: SETTLE_UP,
          payload: response.data,
        })
      )
      .catch((error) => {
        if (error.response && error.response.data) {
          return dispatch({
            type: SETTLE_UP,
            payload: error.response.data,
          });
        }
        return;
      });
  };