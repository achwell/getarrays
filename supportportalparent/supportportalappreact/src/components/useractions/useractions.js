import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Portrait from '@material-ui/icons/Portrait';

import authenticationService from "../../service/autehentication.service";

function UserActions(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => setIsLoggedIn(props.isLoggedIn), [props]);

    const history = useHistory();

    const doLogout = () => {
        authenticationService.logout();
        setIsLoggedIn(false);
        if(props.logOutAction) {
            props.logOutAction(false);
        }
        history.push("/login");
    };

    const doLogin = () => {
        history.push("/login");
        if(props.logInAction) {
            props.logInAction(true);
        }
        setIsLoggedIn(true);
    }

    const profileAction = () => {
        setAnchorEl(null);
        props.profileAction();
    };

    if(!isLoggedIn) {
        return <Button variant="outlined" color="primary" onClick={doLogin}>Log in</Button>;
    }

    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <Portrait/>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={profileAction}>My account</MenuItem>
                <MenuItem onClick={doLogout}>Log Out</MenuItem>
            </Menu>
        </div>
    );
}

UserActions.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    logInAction: PropTypes.func.isRequired,
    logOutAction: PropTypes.func.isRequired,
    profileAction: PropTypes.func.isRequired
}

export default UserActions;