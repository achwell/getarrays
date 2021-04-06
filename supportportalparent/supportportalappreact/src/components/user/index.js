import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import {DataGrid} from "@material-ui/data-grid";
import authenticationService from "../../api/autehentication.service";
import userService from "../../api/user.service";
import Notification from "../notification";

class UserComponent extends Component {

    state = {severity: 'info', message: '', users: []}

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        userService.getUsers()
            .then(response => this.setState({users: response.data}))
            .catch(e => {
                console.log({e})
            })
    }

    canRead = authenticationService.hasPrivilege("user:read");
    canUpdate = authenticationService.hasPrivilege("user:update");
    canCreate = authenticationService.hasPrivilege("user:create");
    canDelete = authenticationService.hasPrivilege("user:delete");
    username = authenticationService.getUsername();

    edit = row => {
        console.log("Edit")
        console.log({row})
        return undefined;
    }

    delete = row => {
        console.log("Delete")
        console.log({row})
        return undefined;
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
        {field: 'userId', headerName: 'UserId', width: 100},
        {field: 'firstName', headerName: 'First name', width: 200},
        {field: 'middleName', headerName: 'Middle name', width: 200},
        {field: 'lastName', headerName: 'Last name', width: 200},
        {field: 'username', headerName: 'Username', width: 150},
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
            </Fragment>
        )
    }
}

export default withRouter(UserComponent);