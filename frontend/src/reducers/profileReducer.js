import { UPDATE_PROFILE  } from '../actions/types';

const initialState = {
    user: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action){
   switch(action.type){
       case UPDATE_PROFILE:
           return {
               ...state,
               user: action.payload
           };
           
       default:
           return state;
   }
};