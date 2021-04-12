import { CREATE_GROUP } from '../actions/types';

const initialState = {
    activities: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_GROUP:
            return {
                ...state,
                activities: action.payload
            };
        default:
            return state;
    }
};
