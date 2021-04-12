import React, {useRef, useState} from 'react';

import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import Toolbar from '@material-ui/core/Toolbar'
import TypoGraphy from '@material-ui/core/Typography'

import authenticationService from "./service/autehentication.service";

import LoginComponent from "./components/login";
import RegisterComponent from "./components/register";
import UserComponent from "./components/user";
import UserActions from "./components/useractions/useractions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#eee"
    },
    button: {
        marginRight: theme.spacing(2),
    },
    h4: {
        flexGrow: 1,
        color: "rgba(0, 0, 0, 0.87)"
    },
}));

function App(props) {

    const classes = useStyles();
    const canCreate = authenticationService.hasPrivilege("user:create");

    const userComponentRef = useRef();

    const [isLoggedIn, setIsLoggedIn] = useState(authenticationService.isLoggedIn());

    const userProfile = () => userComponentRef.current.userProfile();

    return (
        <Router>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <TypoGraphy variant="h4" className={classes.h4}>
                        User Management Portal
                    </TypoGraphy>
                    {canCreate &&
                    <IconButton
                        edge="start"
                        className={classes.button}
                        color="primary"
                        aria-label="Create User"
                        onClick={() => userComponentRef.current.create()}
                    >
                        <AddIcon/>
                    </IconButton>
                    }
                    <IconButton
                        edge="start"
                        className={classes.button}
                        color="primary"
                        aria-label="Reload User"
                        onClick={() => userComponentRef.current.reload()}
                    >
                        <RefreshIcon/>
                    </IconButton>
                        <UserActions isLoggedIn={isLoggedIn} logInAction={setIsLoggedIn} logOutAction={setIsLoggedIn} profileAction={userProfile}/>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/login">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <LoginComponent callBack={setIsLoggedIn}/>}
                </Route>
                <Route exact path="/register">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <RegisterComponent/>}
                </Route>
                <Route exact path="/user/management">
                    {isLoggedIn ? <UserComponent ref={userComponentRef}/> : <Redirect to="/login"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <Redirect to="/login"/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
