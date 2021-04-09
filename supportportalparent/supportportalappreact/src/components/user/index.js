import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import {withSnackbar} from "notistack";
import authenticationService from "../../service/autehentication.service";
import userService from "../../service/user.service";
import {Modal} from "../modal/modal";
import UserForm from "./userform";
import Usertable from "./userTable";

class UserComponent extends Component {

    state = {
        users: [],
        deleteOpen: false,
        editOpen: false,
        selectedUsername: null,
        selectedName: null,
        selectedUser: null
    }

    componentDidMount() {
        this.loadData(false);
    }

    loadData(writeMessage) {
        userService.getUsers()
            .then(response => {
                const users = response.data;
                if(writeMessage) {
                    this.props.enqueueSnackbar(users.length + " users loaded.", {variant: 'success'});
                }
                this.setState({users});
            })
            .catch(e => this.handleError(e))
    }

    canCreate = authenticationService.hasPrivilege("user:create");
    canRead = authenticationService.hasPrivilege("user:read");
    canUpdate = authenticationService.hasPrivilege("user:update");
    canDelete = authenticationService.hasPrivilege("user:delete");
    username = authenticationService.getUsername();

    initEdit = user => {
        let selectedName = this.getFullName(user);
        this.setState({editOpen: true, deleteOpen: false, selectedUsername: user.username, selectedName, selectedUser: user});
    }

    initDelete = user => {
        let selectedName = this.getFullName(user);
        this.setState({deleteOpen: true, editOpen: false, selectedUsername: user.username, selectedName, selectedUser: user});
    }

    doDelete = () => {
        userService.deleteUser(this.state.selectedUsername)
            .then(response => this.handleResponse("deleted"))
            .catch(e => this.handleError(e, () => this.state({deleteOpen: false, editOpen: false})));
    }

    doUpdateUser = (user) => {
        const formData = userService.createUserFormData(this.state.selectedUsername, user);
        userService.updateUser(formData)
            .then(response => this.handleResponse("updated"))
            .catch(e => this.handleError(e, () => this.state({deleteOpen: false, editOpen: false})));
    }

    getFullName = user => {
        let selectedName = user.firstName;
        if (user.middleName) {
            selectedName += " " + user.middleName;
        }
        selectedName += " " + user.lastName;
        return selectedName;
    }

    handleResponse(action) {
        this.props.enqueueSnackbar("User " + this.state.selectedName + " " + action + ".", {variant: 'success'});
        this.setState({
            deleteOpen: false,
            editOpen: false,
            selectedUsername: null,
            selectedName: null,
            selectedUser: null
        });
        this.loadData(false);
    }

    handleError = (e, callback) => {
        let error = "";
        if (e.response) {
            error = e.response.data.message;
        } else if (e.message) {
            error = e.message;
        }
        this.setState({
            deleteOpen: false,
            editOpen: false,
            selectedUsername: null,
            selectedName: null,
            selectedUser: null
        });
        this.props.enqueueSnackbar(error, {variant: 'error'});
        if (callback) {
            callback();
        }
    }

    render() {
        if(!this.canRead) {
            authenticationService.logout();
        }
        if (!authenticationService.isLoggedIn()) {
            this.props.history.push("/login");
        }
        return (
            <Fragment>
                <Usertable rows={this.state.users} edit={this.initEdit} delete={this.initDelete}
                           canUpdate={this.canUpdate} canDelete={this.canDelete} username={this.username}/>
                <Modal isOpen={this.state.deleteOpen} handleClose={() => this.setState({deleteOpen: false})} title="Delete user"
                       handleAction={this.doDelete} actionTitle="Delete">
                    <div>
                        Vil du slette {this.state.selectedUsername + ": " + this.state.selectedName}?
                    </div>
                </Modal>
                <Modal isOpen={this.state.editOpen} handleClose={() => this.setState({editOpen: false})} title="Update user">
                    <UserForm initialValues={this.state.selectedUser} onSubmit={this.doUpdateUser}/>
                </Modal>
            </Fragment>
        )
    }
}

export default withSnackbar(withRouter(UserComponent));