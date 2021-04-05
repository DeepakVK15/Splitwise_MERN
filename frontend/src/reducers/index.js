import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import inviteReducer from './inviteReducer';

export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    invite: inviteReducer,
});