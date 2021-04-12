import { CREATE_GROUP } from "./types";
import axios from "axios";
import {uri} from '../uri';

console.log("In group action");
export const createGroup = (data) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(`${uri}/group/creategroup`, data)
        .then(response => dispatch({
            type: CREATE_GROUP,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: CREATE_GROUP,
                    payload: error.response.data
                });
            }
            return;
        });
}