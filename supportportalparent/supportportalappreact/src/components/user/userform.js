import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Input, InputLabel} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import {FormErrors} from "../formerrors";

const UserForm = forwardRef((props, ref) => {
    useImperativeHandle(
        ref,
        () => ({
            doSave() {
                save();
            }
        }),
    )

    const {readOnly, initialValues, setValidationErrors, onSubmit, currentUserId} = props;

    const [user, setUser] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({username: '', firstName: '', lastName: '', email: '', phone: ''});
    const [fieldErrors, setFieldErrors] = useState({
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
    });
    const [formValid, setFormValid] = useState(false);

    const roles = roleService.getRoles();

    const validateField = (fieldName, value) => {
        let formValidationErrors = {...formErrors};
        let fieldValidationErrors = {...fieldErrors};

        let usernameValid = !fieldValidationErrors.username;
        let firstNameValid = !fieldValidationErrors.firstName;
        let lastNameValid = !fieldValidationErrors.lastName;
        let emailValid = !fieldValidationErrors.email;
        let phoneValid = !fieldValidationErrors.phone;

        let fieldValidated = true;

        switch(fieldName) {
            case 'username':
                usernameValid = value.match(/^[a-z0-9]{7,}$/i);
                formValidationErrors.username = usernameValid ? '': (value && value.length > 6) ? ' contains illegal characters' : ' is too short';
                fieldValidationErrors.username = !usernameValid;
                break;
            case 'firstName':
                firstNameValid = value.length >= 1;
                formValidationErrors.firstName = firstNameValid ? '': ' is too short';
                fieldValidationErrors.firstName = !firstNameValid;
                break;
            case 'lastName':
                lastNameValid = value.length >= 1;
                formValidationErrors.lastName = lastNameValid ? '': ' is too short';
                fieldValidationErrors.lastName = !lastNameValid;
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                formValidationErrors.email = emailValid ? '' : ' is invalid';
                fieldValidationErrors.email = !emailValid;
                break;
            case 'phone':
                phoneValid = value.length >= 8;
                formValidationErrors.phone = phoneValid ? '': ' is too short';
                fieldValidationErrors.phone = !phoneValid;
                break;
            default:
                fieldValidated = false;
                break;
        }
        if(fieldValidated) {
            setFormErrors(formValidationErrors);
            setFieldErrors(fieldValidationErrors);
            validateForm();
        }
    }

    const validateForm = () => {
        const {username, firstName, lastName, email, phone} = fieldErrors;
        setFormValid(!username, !firstName && !lastName && !email && !phone);
        setValidationErrors(formValid);
    }

    const isEditProfile = () => currentUserId === user.id

    const isUpdate = () => !!user.id;

    const save = () => {
        user.roleId = null;
        onSubmit(user);
    }

    const handleInputChange = e => {
        console.log("handleInputChange")
        console.log({readOnly})
        if (!readOnly) {
            const name = e.target.name;
            const value = e.target.value;
            setUser({...user, [name]: value});
            validateField(name, value)
        }
    };

    const handleCheckboxChange = e => {
        console.log("handleCheckboxChange")
        console.log({readOnly})
        if (!readOnly && !isEditProfile()) {
            const name = e.target.name;
            const checked = e.target.checked;
            setUser({...user, [name]: checked});
            validateField(name, checked)
        }
    };

    const handleRoleInputChange = e => {
        console.log("handleRoleInputChange")
        console.log({readOnly})
        if (!readOnly && !isEditProfile()) {
            const roleId = e.target.value;
            const role = roles.filter(role => role.id === roleId)[0];
            setUser({...user, role, roleId});
            validateField('role', roleId)
        }
    }

    const getRoles = () => {
        return roles.sort((a, b) => a.id - b.id).map(role => {
            return <MenuItem key={role.id} value={role.id}>{role.name.replace(/^(ROLE_)/, "")}</MenuItem>

        });
    };

    if (!user) {
        return null;
    }
    for (const property in user) {
        validateField(property, user[property]);
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: 0,
                padding: 0
            }}
        >
            <form style={{width: "100%"}} autoComplete="off">
                <FormErrors formErrors={formErrors} />
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" name="username"
                           readOnly={readOnly || isUpdate()} type="text" required
                           value={user.username}
                           onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="firstName">First name</InputLabel>
                    <Input id="firstName" name="firstName" readOnly={readOnly} type="text" required
                           value={user.firstName}
                           onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="middleName">Middle name</InputLabel>
                    <Input id="middleName" name="middleName" readOnly={readOnly} type="text"
                           value={user.middleName} onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="lastName">Last name</InputLabel>
                    <Input id="lastName" name="lastName" readOnly={readOnly} type="text" required
                           value={user.lastName}
                           onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" name="email" readOnly={readOnly} type="email" required value={user.email}
                           onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="phone">Phone</InputLabel>
                    <Input id="phone" name="phone" readOnly={readOnly} type="text" required value={user.phone}
                           onChange={handleInputChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="active">Active</InputLabel>
                    <Checkbox id="active" name="active" readOnly={readOnly || isEditProfile()}
                              checked={user.active} onChange={handleCheckboxChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="notLocked">Not Locked</InputLabel>
                    <Checkbox id="notLocked" name="notLocked" readOnly={readOnly || isEditProfile()}
                              checked={user.notLocked} onChange={handleCheckboxChange}/>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        readOnly={readOnly || isEditProfile()}
                        value={user.roleId}
                        onChange={handleRoleInputChange}
                        autoWidth
                    >
                        {getRoles()}
                    </Select>
                </FormControl>
            </form>
        </div>
    )

});

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
