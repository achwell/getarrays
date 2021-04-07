import React, {useState} from 'react';

import {Redirect, Route, Router, Switch} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import TypoGraphy from '@material-ui/core/Typography'

import history from "./utils/history";

import authenticationService from "./service/autehentication.service";

import LoginComponent from "./components/login";
import RegisterComponent from "./components/register";
import UserComponent from "./components/user";
import LogInOutButton from "./components/logInOutButton/ loginoutbutton";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#eee"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    h4: {
        flexGrow: 1,
        color: "rgba(0, 0, 0, 0.87)"
    },
}));

function App(props) {

    const classes = useStyles();

    const [isLoggedIn, setIsLoggedIn] = useState(authenticationService.isLoggedIn());

    return (
        <Router history={history}>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <TypoGraphy variant="h4" className={classes.h4}>
                        User Management Portal
                    </TypoGraphy>
                    <LogInOutButton isLoggedIn={isLoggedIn} history={history} callBack={setIsLoggedIn}/>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/login">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <LoginComponent history={history} callBack={setIsLoggedIn}/>}
                </Route>
                <Route exact path="/register">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <RegisterComponent/>}
                </Route>
                <Route exact path="/user/management">
                    {isLoggedIn ? <UserComponent/> : <Redirect to="/login"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <Redirect to="/login"/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
