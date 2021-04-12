import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Checkbox, Input, InputLabel} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import {FormErrors} from "../formerrors";


class UserForm extends Component {

    state = {
        user: this.props.initialValues,
        roles: roleService.getRoles(),
        formErrors: {username: '', firstName: '', lastName: '', email: '', phone: ''},
        fieldErrors: {username: true, firstName: true, lastName: true, email: true, phone: true},
        formValid: false
    }

    componentDidMount() {
        this.validateField('username', this.state.user.username);
        this.validateField('firstName', this.state.user.firstName);
        this.validateField('lastName', this.state.user.lastName);
        this.validateField('email', this.state.user.email);
        this.validateField('phone', this.state.user.phone);
    }

    isUpdate = () => !!this.state.user.id;
    isEditProfile = () => this.props.currentUserId === this.state.user.id

    handleInputChange = e => {
        if (!this.props.readOnly) {
            const name = e.target.name;
            const value = e.target.value;
            this.setState({user: {...this.state.user, [name]: value}});
            this.validateField(name, value)
        }
    }
    handleCheckboxChange = e => {
        if (!this.props.readOnly && !this.isEditProfile()) {
            const name = e.target.name;
            const checked = e.target.checked;
            this.setState({user: {...this.state.user, [name]: checked}});
            this.validateField(name, checked);
        }
    }
    handleRoleInputChange = e => {
        if (!this.props.readOnly && !this.isEditProfile()) {
            const name = e.target.name;
            const roleId = e.target.value;
            const role = this.state.roles.filter(role => role.id === roleId)[0];
            this.setState({user: {...this.state.user, role, roleId}});
            this.validateField(name, roleId)
        }

    }

    validateField(fieldName, value) {
        const {formErrors, fieldErrors} = this.state;

        let usernameValid = !fieldErrors.username;
        let firstNameValid = !fieldErrors.firstName;
        let lastNameValid = !fieldErrors.lastName;
        let emailValid = !fieldErrors.email;
        let phoneValid = !fieldErrors.phone;

        let fieldValidated = true;

        switch (fieldName) {
            case 'username':
                usernameValid = value.match(/^[a-z0-9]{7,}$/i);
                formErrors.username = usernameValid ? '' : (value && value.length > 6) ? ' contains illegal characters' : ' is too short';
                fieldErrors.username = !usernameValid;
                break;
            case 'firstName':
                firstNameValid = value.length >= 1;
                formErrors.firstName = firstNameValid ? '' : ' is too short';
                fieldErrors.firstName = !firstNameValid;
                break;
            case 'lastName':
                lastNameValid = value.length >= 1;
                formErrors.lastName = lastNameValid ? '' : ' is too short';
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
                fieldValidated = false;
                break;
        }
        if (fieldValidated) {
            this.setState({formErrors, fieldErrors})
            this.validateForm();
        }
    }

    validateForm = () => {
        const {username, firstName, lastName, email, phone} = this.state.fieldErrors;
        const formValid = !username && !firstName && !lastName && !email && !phone;
        this.setState({formValid});
        this.props.setValidationErrors(formValid);
    }

    save = () => {
        const user = _.omit(this.state.user, 'roleId');
        this.props.onSubmit(user);
    }

    getRoles = () => {
        return this.state.roles.sort((a, b) => a.id - b.id).map(role => <MenuItem
            key={role.id}
            value={role.id}>{role.name.replace(/^(ROLE_)/, "")}</MenuItem>);
    };

    render() {
        const {readOnly} = this.props;
        const {user, formErrors} = this.state;
        return (
            <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
                <form style={{width: "100%"}} autoComplete="off">
                    <FormErrors formErrors={formErrors}/>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username"
                               readOnly={readOnly || this.isUpdate()} type="text" required
                               value={user.username}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="firstName">First name</InputLabel>
                        <Input id="firstName" name="firstName" readOnly={readOnly} type="text" required
                               value={user.firstName}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="middleName">Middle name</InputLabel>
                        <Input id="middleName" name="middleName" readOnly={readOnly} type="text"
                               value={user.middleName} onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="lastName">Last name</InputLabel>
                        <Input id="lastName" name="lastName" readOnly={readOnly} type="text" required
                               value={user.lastName}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" name="email" readOnly={readOnly} type="email" required value={user.email}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input id="phone" name="phone" readOnly={readOnly} type="text" required value={user.phone}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="active">Active</InputLabel>
                        <Checkbox id="active" name="active" readOnly={readOnly || this.isEditProfile()}
                                  checked={user.active} onChange={this.handleCheckboxChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="notLocked">Not Locked</InputLabel>
                        <Checkbox id="notLocked" name="notLocked" readOnly={readOnly || this.isEditProfile()}
                                  checked={user.notLocked} onChange={this.handleCheckboxChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            readOnly={readOnly || this.isEditProfile()}
                            value={user.roleId}
                            onChange={this.handleRoleInputChange}
                            autoWidth
                        >
                            {this.getRoles()}
                        </Select>
                    </FormControl>
                </form>
            </div>
        );
    }
}

UserForm.propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    setValidationErrors: PropTypes.func,
    currentUserId: PropTypes.number
};
UserForm.defaultProps = {
    initialValues: {},
    onSubmit: () => {},
    readOnly: false,
    setValidationErrors: () => {}
};

export default withSnackbar(UserForm);
