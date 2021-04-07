import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import {Button, Input, InputLabel} from "@material-ui/core";
import {withSnackbar} from "notistack";

import authenticationService from "../../service/autehentication.service";
import roleService from "../../service/role.service";

class LoginComponent extends Component {

    state = {username: '', password: ''}

    handleChange = event => {
        const value = event.target.value;
        if (value) {
            event.target.classList.add("used");
        } else {
            event.target.classList.remove("used");
        }
        this.setState({[event.target.name]: value});
    }

    loginClicked = () => {
        authenticationService.login({username: this.state.username, password: this.state.password})
            .then(response => {
                const token = response.headers["jwt-token"];
                authenticationService.saveToken(token);
                authenticationService.addUserToLocalCache(response.data);
                roleService.loadRoles();
                if (this.props.callBack) {
                    this.props.callBack(true);
                }
                this.props.history.push('/user/management');
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
            });
    }

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>
                <form style={{width: "100%"}} autoComplete="off">
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username" type="text" required value={this.state.username} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input id="password" name="password" type="password" required value={this.state.password} onChange={this.handleChange}/>
                    </FormControl>
                    <div>
                        <Button variant="outlined" color="primary" onClick={this.loginClicked}>Log in</Button>
                    </div>
                    <br/>
                    <div className="group">
                        Don't have an account?
                        <Link to="/register">Sign Up</Link>
                    </div>
                </form>
            </div>
        )
    }
}

LoginComponent.propTypes = {
    callBack: PropTypes.func
}

export default withRouter(withSnackbar(LoginComponent));