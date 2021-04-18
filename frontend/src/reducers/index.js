import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import inviteReducer from './inviteReducer';
import groupReducer from './groupReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    invite: inviteReducer,
    group: groupReducer,
    profile: profileReducer
});