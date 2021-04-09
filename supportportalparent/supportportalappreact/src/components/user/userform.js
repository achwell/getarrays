import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Input, InputLabel} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";

class UserForm extends Component {

    state = {}

    roles = roleService.getRoles();

    componentDidMount() {
        const {initialValues} = this.props;
        if(!initialValues.role) {
            initialValues.role = this.roles.filter(role => role.name === "ROLE_USER")[0];
        }
        this.setState({values: {...initialValues, roleId: initialValues.role.id}});
    }

    save = () => {
        const user = this.state.values;
        user.roleId = null;
        this.props.onSubmit(user);
    }

    handleInputChange = e => this.setState({values: {...this.state.values, [e.target.name]: e.target.value}});

    handleCheckboxChange = e => this.setState({values: {...this.state.values, [e.target.name]: e.target.checked}});

    handleRoleInputChange = e => {
        const roleId = e.target.value;
        const role = this.roles.filter(role => role.id === roleId)[0];
        this.setState({values: {...this.state.values, role, roleId}});
    }

    getRoles = () => {
        return this.roles.sort((a, b) => a.id - b.id).map(role => {
            return <MenuItem key={role.id} value={role.id}>{role.name.replace(/^(ROLE_)/,"")}</MenuItem>

        });
    };

    render() {
        const {values} = this.state;
        if(!values) {
            return null;
        }
        const update = !!values.id;
        const roles = this.getRoles();
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 20,
                    padding: 20
                }}
            >
                <form style={{width: "100%"}} autoComplete="off">
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username" readOnly={update}  type="text" required value={values.username}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="firstName">First name</InputLabel>
                        <Input id="firstName" name="firstName" type="text" required value={values.firstName}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="middleName">Middle name</InputLabel>
                        <Input id="middleName" name="middleName" type="text" value={values.middleName} onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="lastName">Last name</InputLabel>
                        <Input id="lastName" name="lastName" type="text" required value={values.lastName}
                               onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" name="email" type="email" required value={values.email} onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input id="phone" name="phone" type="text" required value={values.phone} onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="active">Active</InputLabel>
                        <Checkbox id="active" name="active" checked={values.active} onChange={this.handleCheckboxChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="notLocked">Not Locked</InputLabel>
                        <Checkbox id="notLocked" name="notLocked" checked={values.notLocked} onChange={this.handleCheckboxChange}/>
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={values.roleId}
                            onChange={this.handleRoleInputChange}
                            autoWidth
                        >
                            {roles}
                        </Select>
                    </FormControl>
                    <div>
                        <Button variant="contained" color="primary" onClick={this.save}>{update ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </div>
        )
    }

}

UserForm.propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,

};
export default withSnackbar(UserForm);
