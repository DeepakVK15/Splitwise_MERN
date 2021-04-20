import { UPDATE_PROFILE } from "./types";
import axios from "axios";
import {uri} from '../uri';

export const updateProfile = (data) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.put(`${uri}/profile/`, data)
        .then(response => dispatch({
            type: UPDATE_PROFILE,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: UPDATE_PROFILE,
                    payload: error.response.data
                });
            }
            return;
        });
}