import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import authenticationService from "../../service/autehentication.service";
import {Button, Input, InputLabel} from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from "notistack";
import {FormErrors} from "../formerrors";

const INITIAL_STATE = {
    user: {
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: Math.random().toString(16).substr(2, 8),
        role: {id: -1, name: 'UNKNOWN'}
    },
    formErrors: {username: '', firstName: '', lastName: '', email: '', phone: ''},
    fieldErrors: {
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
    },
    formValid: false
};

class RegisterComponent extends Component {

    state = INITIAL_STATE;

    validateField = (fieldName, value) => {
        let {formErrors, fieldErrors} = this.state;

        let usernameValid = !fieldErrors.username;
        let firstNameValid = !fieldErrors.firstName;
        let lastNameValid = !fieldErrors.lastName;
        let emailValid = !fieldErrors.email;
        let phoneValid = true;

        switch (fieldName) {
            case 'username':
                usernameValid = value.match(/^[a-z0-9]{7,}$/i);
                formErrors.username = usernameValid ? '' : (value && value.length > 6) ? ' contains illegal characters' : ' is too short';
                fieldErrors.username = !usernameValid;
                break;
            case 'firstName':
                firstNameValid = value.length >= 1;
                formErrors.firstName = firstNameValid ? '' : ' is required';
                fieldErrors.firstName = !firstNameValid;
                break;
            case 'lastName':
                lastNameValid = value.length >= 1;
                formErrors.lastName = lastNameValid ? '' : ' is required';
                fieldErrors.lastName = !lastNameValid;
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                formErrors.email = emailValid ? '' : ' is invalid';
                fieldErrors.email = !emailValid;
                break;
            case 'phone':
                phoneValid = value.length >= 8;
                formErrors.phone = phoneValid ? '' : ' is too short';
                fieldErrors.phone = !phoneValid;
                break;
            default:
                break;
        }
        this.setState({formErrors, fieldErrors});
        this.validateForm();
    }

    validateForm = () => {
        const {username, firstName, lastName, email, phone} = this.state.fieldErrors;
        this.setState({formValid: !username && !firstName && !lastName && !email && !phone});
    }

    handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        let {user} = this.state;
        user = {...user, [name]: value};
        this.setState({user});
        this.validateField(name, value)
    }

    registerClicked = () => {
        for (const property in this.state.user) {
            this.validateField(property, this.state.user[property]);
        }
        if (!this.state.formValid) {
            return;
        }

        authenticationService.register(this.state.user)
            .then(response => {
                const message = `A new account was created for ${response.data.firstName}. Please check your email for password to log in.`;
                this.props.enqueueSnackbar(message, {variant: 'success'});
                this.setState(INITIAL_STATE);
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
                if(e.response.status === 400) {
                    const jsonObject = JSON.parse(e.response.data.message);
                    let {formErrors, fieldErrors} = this.state;
                    Object.keys(jsonObject).forEach(function(key) {
                        var value = jsonObject[key];
                        fieldErrors[key] = true;
                        formErrors[key] = value;
                    });
                    this.setState({formErrors, fieldErrors})
                }
            })
    }

    render() {
        if (authenticationService.isLoggedIn()) {
            this.props.history.push("/user/management");
        }
        return (
            <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
                <form style={{width: "100%"}} autoComplete="off">
                    <FormErrors formErrors={this.state.formErrors}/>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username" required
                               value={this.state.user.username}
                               onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="firstName">First name</InputLabel>
                        <Input id="firstName" name="firstName" type="text" required
                               value={this.state.user.firstName}
                               onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="middleName">Middle name</InputLabel>
                        <Input id="middleName" name="middleName" type="text"
                               value={this.state.user.middleName} onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="lastName">Last name</InputLabel>
                        <Input id="lastName" name="lastName" type="text" required
                               value={this.state.user.lastName}
                               onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" name="email" type="email" required value={this.state.user.email}
                               onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input id="phone" name="phone" type="text" required value={this.state.user.phone}
                               onChange={this.handleInputChange}
                               autoComplete="off"/>
                    </FormControl>
                    <Button variant="outlined" color="primary" onClick={this.registerClicked}
                            disabled={!this.state.formValid}>Register</Button>
                    <div className="group">
                        Already have an account?
                        <Link to="/login">Log In</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default withSnackbar(withRouter(RegisterComponent));