import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from "./components/Dashboard/Dashboard";
// import Home from './Home/Home';
// import Delete from './Delete/Delete';
// import Create from './Create/Create';
import Landing from "./components/Landing/Landing";
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Landing} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/dashboard" component={Dashboard} />
            </div>
        )
    }
}

export default Main;