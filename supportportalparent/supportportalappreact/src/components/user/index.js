import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import {DataGrid} from "@material-ui/data-grid";
import authenticationService from "../../api/autehentication.service";
import userService from "../../api/user.service";
import Notification from "../notification";
import {Modal} from "../modal/modal";

class UserComponent extends Component {

    state = {severity: 'info', message: '', users: [], deleteOpen: false, editOpen: false, selectedUsername: null, selectedName: null, selectedUser: null}

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
                this.setState({error, severity: 'error'});
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
        this.setState({editOpen: true, selectedUsername: row.username, selectedName, selectedUser: row});
    }

    toggleEditModal = e => {
        this.setState({deleteOpen: !this.state.deleteOpen});
    };

    updateUser = () => {
        const formData = userService.createUserFormData(this.state.selectedUsername, this.state.selectedUser);
        userService.updateUser(formData)
            .then(response => {
                let message = "User " + this.state.selectedName + " updated.";
                this.setState({message, severity: 'success', editOpen: false, selectedUsername: null, selectedName: null, selectedUser: null});
                this.loadData();
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.setState({error, severity: 'error', editOpen: false});
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
                let message = "User " + this.state.selectedName + " deleted.";
                this.setState({message, severity: 'success', deleteOpen: false, selectedUsername: null, selectedName: null, selectedUser: null});
                this.loadData();
            })
            .catch(e => {
                let error = "";
                if (e.response) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.setState({error, severity: 'error', deleteOpen: false});
            })
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
        {field: 'username', headerName: 'Username', width: 150},
        {field: 'firstName', headerName: 'First name', width: 200},
        {field: 'middleName', headerName: 'Middle name', width: 200},
        {field: 'lastName', headerName: 'Last name', width: 200},
        {field: 'email', headerName: 'Email', width: 200},
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
            width: 100,
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
                <Notification message={this.state.message} severity={this.state.severity}/>
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={this.state.users}
                        columns={this.columns}
                        pageSize={25}
                        size="small"
                        allowColumnResizing={true}
                        selection={{mode: 'single'}}
                    >
                    </DataGrid>
                </div>
                <Modal
                    isOpen={this.state.deleteOpen}
                    handleClose={this.toggleDeleteModal}
                    title="Delete user"
                    handleAction={this.doDelete}
                    actionTitle="Delete"
                >
                    <div>
                        Vil du slette {this.state.selectedUsername + ": " + this.state.selectedName}?
                    </div>
                </Modal>
                <Modal
                    isOpen={this.state.editOpen}
                    handleClose={this.toggleEditModal}
                    title="Update user"
                    handleAction={this.updateUser}
                    actionTitle="Save"
                >
                    <div>
                        Vil du slette {this.state.selectedUsername + ": " + this.state.selectedName}?
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export default withRouter(UserComponent);