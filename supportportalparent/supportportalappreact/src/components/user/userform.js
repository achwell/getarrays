import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Input, InputLabel, Button} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class UserForm extends Component {

    state = {values: this.props.initialValues}

    save = () => {
        this.props.onSubmit(this.state.values);
    }

    handleInputChange = e => this.setState({values: {...this.state.values, [e.target.name]: e.target.value}});

    handleCheckboxChange = e => this.setState({values: {...this.state.values, [e.target.name]: e.target.checked}});

    render() {
        const {values} = this.state;
        const update = !!values.id;
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
                            value={values.role}
                            onChange={this.handleInputChange}
                            autoWidth
                        >
                            <MenuItem value="ROLE_USER">ROLE_USER</MenuItem>
                            <MenuItem value="ROLE_MANAGER_AUTHORITIES">ROLE_MANAGER_AUTHORITIES</MenuItem>
                            <MenuItem value="ROLE_ADMIN_AUTHORITIES">ROLE_ADMIN_AUTHORITIES</MenuItem>
                            <MenuItem value="ROLE_SUPER_ADMIN_AUTHORITIES">ROLE_SUPER_ADMIN_AUTHORITIES</MenuItem>
                        </Select>
                    </FormControl>
                    <div>
                        <Button variant="contained" color="primary" onClick={() => this.save}>{update ? "Update" : "Create"}</Button>
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
export default UserForm;
