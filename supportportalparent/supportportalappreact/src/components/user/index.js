import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import {DataGrid} from "@material-ui/data-grid";
import {withSnackbar} from "notistack";
import authenticationService from "../../service/autehentication.service";
import userService from "../../service/user.service";
import {Modal} from "../modal/modal";
import UserForm from "./userform";

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
        this.loadData();
    }

    loadData() {
        userService.getUsers()
            .then(response => this.setState({users: response.data}))
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
            })
    }

    canRead = authenticationService.hasPrivilege("user:read");
    canUpdate = authenticationService.hasPrivilege("user:update");
    canCreate = authenticationService.hasPrivilege("user:create");
    canDelete = authenticationService.hasPrivilege("user:delete");
    username = authenticationService.getUsername();

    edit = row => {
        let selectedName = row.firstName;
        if (row.middleName) {
            selectedName += " " + row.middleName;
        }
        selectedName += " " + row.lastName;
        row.role = row.role.name;
        this.setState({editOpen: true, selectedUsername: row.username, selectedName, selectedUser: row});
    }

    toggleEditModal = e => {
        this.setState({editOpen: !this.state.editOpen});
    };

    updateUser = (user) => {
        const formData = userService.createUserFormData(this.state.selectedUsername, user);
        userService.updateUser(formData)
            .then(response => {
                this.props.enqueueSnackbar("User " + this.state.selectedName + " updated.", {variant: 'success'});
                this.setState({editOpen: false, selectedUsername: null, selectedName: null, selectedUser: null});
                this.loadData();
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
                this.toggleEditModal();
            });
    }

    delete = row => {
        let selectedName = row.firstName;
        if (row.middleName) {
            selectedName += " " + row.middleName;
        }
        selectedName += " " + row.lastName;
        this.setState({deleteOpen: true, selectedUsername: row.username, selectedName, selectedUser: row});
    }

    toggleDeleteModal = e => {
        this.setState({deleteOpen: !this.state.deleteOpen});
    };

    doDelete = () => {
        userService.deleteUser(this.state.selectedUsername)
            .then(response => {
                this.props.enqueueSnackbar("User " + this.state.selectedName + " deleted.", {variant: 'success'});
                this.setState({deleteOpen: false, selectedUsername: null, selectedName: null, selectedUser: null});
                this.loadData();
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
                this.toggleDeleteModal();
            })
    }
    renderRoleCell = params => {
        const {role} = params.row;
        const roleName = role.name ? role.name : role;
        const label = roleName.replace(/^(ROLE_)/,"");
        return <span>{label}</span>;

    }

    renderStatusCell = params => {
        const {active, notLocked} = params.row;
        let lockIcon = notLocked ? "lock_open" : "lock";
        let title = notLocked ? "Open" : "Locked";
        let lockClass = notLocked ? "green" : "red";
        let activeIcon = active ? "check_circle_outline" : "highlight_off";
        let activeTitle = active ? "Active" : "Inactive";
        let activeClass = active ? "green" : "red";

        return (
            <div>
                <i className={`material-icons icon-image-preview ${lockClass}`} title={title}>{lockIcon}</i>
                <i className={`material-icons icon-image-preview ${activeClass}`} title={activeTitle}>{activeIcon}</i>
            </div>
        );
    };

    renderActionsCell = params => {
        const onClick = () => {
            return this.edit(params.row);
        };
        const onDelete = () => {
            return this.delete(params.row);
        };
        return <div>
            {this.canUpdate && <i className="material-icons icon-image-preview pointer" title="Edit user" onClick={onClick}>edit_note</i>}
            {this.canDelete && this.username !== params.row.username && <i className="material-icons icon-image-preview pointer" title="Delete user" onClick={onDelete}>delete</i>}
        </div>;
    };

    columns = [
        {field: 'username', headerName: 'Username', width: 120},
        {field: 'firstName', headerName: 'First name', width: 170},
        {field: 'middleName', headerName: 'Middle name', width: 170},
        {field: 'lastName', headerName: 'Last name', width: 170},
        {field: 'email', headerName: 'Email', width: 200},
        {field: 'phone', headerName: 'Phone', width: 100},
        {field: 'role', headerName: 'Role', width: 225, renderCell: params => this.renderRoleCell(params)},
        {
            field: 'active',
            headerName: 'Status',
            filterable: false,
            sortable: false,
            renderCell: params => this.renderStatusCell(params)
        },
        (this.canUpdate || this.canDelete) &&
        {
            field: "notLocked",
            sortable: false,
            filterable: false,
            headerName: "Actions",
            width: 120,
            disableClickEventBubbling: true,
            renderCell: params => this.renderActionsCell(params)
        },
    ]

    render() {
        if(!this.canRead) {
            authenticationService.logout();
        }
        if (!authenticationService.isLoggedIn()) {
            this.props.history.push("/login");
        }
        return (
            <Fragment>
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid rows={this.state.users} columns={this.columns} pageSize={25} size="small"
                              allowColumnResizing={true} selection={{mode: 'single'}}/>
                </div>
                <Modal isOpen={this.state.deleteOpen} handleClose={this.toggleDeleteModal} title="Delete user"
                       handleAction={this.doDelete} actionTitle="Delete">
                    <div>
                        Vil du slette {this.state.selectedUsername + ": " + this.state.selectedName}?
                    </div>
                </Modal>
                <Modal isOpen={this.state.editOpen} handleClose={this.toggleEditModal} title="Update user">
                    <UserForm initialValues={this.state.selectedUser} onSubmit={this.updateUser}/>
                </Modal>
            </Fragment>
        )
    }
}

export default withSnackbar(withRouter(UserComponent));