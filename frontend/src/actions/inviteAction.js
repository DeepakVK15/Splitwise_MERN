import { ACCEPT_INVITE, REJECT_INVITE } from "./types";
import axios from "axios";
import {uri} from '../uri';

export const acceptInvite = (data) => dispatch => {
    axios
      .post(`${uri}/mygroups/acceptInvite`, data).then(response => dispatch({
        type: ACCEPT_INVITE,
        payload: response.data
    }))
    .catch(error => {
        if (error.response && error.response.data) {
            return dispatch({
                type: ACCEPT_INVITE,
                payload: error.response.data
            });
        }
    });
}

export const rejectInvite = (data) => dispatch => {
    axios
      .post(`${uri}/mygroups/rejectInvite`, data).then(response => dispatch({
        type: REJECT_INVITE,
        payload: response.data
    }))
    .catch(error => {
        if (error.response && error.response.data) {
            return dispatch({
                type: REJECT_INVITE,
                payload: error.response.data
            });
        }
    });
}

