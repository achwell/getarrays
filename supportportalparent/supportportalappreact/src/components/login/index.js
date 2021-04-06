import React, {Component, Fragment} from "react";
import {withRouter} from "react-router-dom";
import authenticationService from "../../api/autehentication.service";
import './login.scss';
import Notification from "../notification/Notification";

class LoginComponent extends Component {

    state = {
        username: '',
        password: '',
        error: ''
    }

    handleChange = event => {
        const value = event.target.value;
        if(value) {
            event.target.classList.add("used");
        } else {
            event.target.classList.remove("used");
        }
        this.setState({[event.target.name]: value, error: ""});
    }

    loginClicked = () => {
        authenticationService.login({username: this.state.username, password: this.state.password})
            .then(response => {
                console.log(response);
                const token = response.headers["jwt-token"];
                authenticationService.saveToken(token);
                authenticationService.addUserToLocalCache(response.data);
                this.props.history.push('/user/management');
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.setState({error});
            });
    }

    render() {
        if (authenticationService.isLoggedIn()) {
            this.props.history.push("/user/management");
        }
        return (
            <Fragment>
                <Notification message={this.state.error} severity="error"/>
                <hgroup>
                    <h1>User Management Portal</h1>
                </hgroup>
                <form>
                    <div className="group">
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Username</label>
                    </div>
                    <div className="group">
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Password</label>
                    </div>
                    <button type="button" className="button buttonBlue" onClick={this.loginClicked}>Login
                        <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                    </button>
                </form>
            </Fragment>
        )
    }
}

export default withRouter(LoginComponent);