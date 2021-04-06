import React, {Component, Fragment} from 'react';
import {Link, withRouter} from "react-router-dom";
import Notification from "../notification";
import authenticationService from "../../api/autehentication.service";

class RegisterComponent extends Component {

    state = {
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        severity: 'info',
        message: ''
    }

    handleChange = event => {
        const value = event.target.value;
        if (value) {
            event.target.classList.add("used");
        } else {
            event.target.classList.remove("used");
        }
        this.setState({[event.target.name]: value, message: ""});
    }

    registerClicked = () => {
        this.setState({severity: 'info', message: ""});
        authenticationService.register({
            firstName: this.state.firstName,
            middlename: this.state.middleName,
            lastName: this.state.lastName,
            username: this.state.username,
            email: this.state.email
        })
            .then(response => {
                const message = `A new account was created for ${response.data.firstName}. Please check your email for password to log in.`;
                this.setState({
                    firstName: '',
                    middlename: '',
                    lastName: '',
                    username: '',
                    email: '',
                    severity: 'success',
                    message
                });
            })
            .catch(e => {
                console.log({e})
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                console.log({error})
                this.setState({severity: 'error', message: error});
            })
    }

    render() {
        if (authenticationService.isLoggedIn()) {
            this.props.history.push("/user/management");
        }
        return (
            <Fragment>
                <Notification message={this.state.message} severity={this.state.severity}/>
                <form>
                    <div className="group">
                        <input type="text" name="firstName" required value={this.state.firstName}
                               onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>First name</label>
                    </div>
                    <div className="group">
                        <input type="text" name="middleName" value={this.state.middleName}
                               onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Middle name</label>
                    </div>
                    <div className="group">
                        <input type="text" name="lastName" required value={this.state.lastName}
                               onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Last name</label>
                    </div>
                    <div className="group">
                        <input type="text" name="username" required value={this.state.username}
                               onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Username</label>
                    </div>
                    <div className="group">
                        <input type="email" name="email" required value={this.state.email}
                               onChange={this.handleChange}/>
                        <span className="highlight"></span><span className="bar"></span>
                        <label>Email</label>
                    </div>
                    <button type="button" className="button buttonBlue" onClick={this.registerClicked}>Register
                        <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                    </button>
                    <div className="group">
                        Already have an account?
                        <Link to="/login">Log In</Link>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default withRouter(RegisterComponent);