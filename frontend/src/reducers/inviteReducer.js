import { ACCEPT_INVITE, REJECT_INVITE } from '../actions/types';

const initialState = {
    invites: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
    switch (action.type) {
        case ACCEPT_INVITE:
            return {
                ...state,
                invites: action.payload
            };
            case REJECT_INVITE:
            return {
                ...state,
                invites: action.payload
            };
        default:
            return state;
    }
};
