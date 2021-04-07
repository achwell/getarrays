import React, {useState, useEffect} from 'react';

import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";

import authenticationService from "../../service/autehentication.service";

function LogInOutButton(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);

    useEffect(() => setIsLoggedIn(props.isLoggedIn), [props]);

    const doLogout = () => {
        authenticationService.logout();
        setIsLoggedIn(false);
        if(props.callBack) {
            props.callBack(false);
        }
        props.history.push("/login");
    };

    const doLogin = () => {
        props.history.push("/login");
        if(props.callBack) {
            props.callBack(true);
        }
        setIsLoggedIn(true);
    }

    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={isLoggedIn ? doLogout : doLogin}>
            {isLoggedIn ? "Log Out" : "Log in"}
        </Button>
    );
}

LogInOutButton.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    callBack: PropTypes.func
}

export default LogInOutButton;