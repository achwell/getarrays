import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Input, InputLabel} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import authenticationService from "../../service/autehentication.service";

const UserForm = forwardRef((props, ref) => {
    useImperativeHandle(
        ref,
        () => ({
            doSave() {
                save();
            }
        }),
    )

    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(props.initialValues);

    const {readOnly} = props;

    const roles = roleService.getRoles();

    useEffect(() => {
        const currentUser = authenticationService.getUserFromLocalCache();
        if (currentUser) {
            setUserId(currentUser.id);
        }
    }, []);

    const isEditProfile = () => userId === user.id

    const isUpdate = () => !!user.id;

    const save = () => {
        user.roleId = null;
        props.onSubmit(user);
    }

    const handleInputChange = e => {
        if (!props.readOnly) {
            setUser({...user, [e.target.name]: e.target.value});
        }
    };

    const handleCheckboxChange = e => {
        if (!props.readOnly && !isEditProfile()) {
            setUser({...user, [e.target.name]: e.target.checked});
        }
    };

    const handleRoleInputChange = e => {
        if (!props.readOnly && !isEditProfile()) {
            const roleId = e.target.value;
            const role = roles.filter(role => role.id === roleId)[0];
            setUser({...user, role, roleId});
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
    readOnly: PropTypes.bool
};
export default withSnackbar(UserForm);
