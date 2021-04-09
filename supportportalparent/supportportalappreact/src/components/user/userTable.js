import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {DataGrid} from "@material-ui/data-grid";

function Usertable(props) {

    const renderRoleCell = params => {
        const {role} = params.row;
        const roleName = role.name ? role.name : role;
        const label = roleName.replace(/^(ROLE_)/,"");
        return <span>{label}</span>;
    }

    const renderStatusCell = params => {
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

    const renderActionsCell = params => {
        const onClick = () => {
            return props.edit(params.row);
        };
        const onDelete = () => {
            return props.delete(params.row);
        };
        return <div>
            {props.canUpdate && <i className="material-icons icon-image-preview pointer" title="Edit user" onClick={onClick}>edit_note</i>}
            {props.canDelete && props.username !== params.row.username && <i className="material-icons icon-image-preview pointer" title="Delete user" onClick={onDelete}>delete</i>}
        </div>;
    };

    const columns = [
        {field: 'username', headerName: 'Username', width: 120},
        {field: 'firstName', headerName: 'First name', width: 170},
        {field: 'middleName', headerName: 'Middle name', width: 170},
        {field: 'lastName', headerName: 'Last name', width: 170},
        {field: 'email', headerName: 'Email', width: 200},
        {field: 'phone', headerName: 'Phone', width: 100},
        {field: 'role', headerName: 'Role', width: 225, renderCell: params => renderRoleCell(params)},
        {
            field: 'active',
            headerName: 'Status',
            filterable: false,
            sortable: false,
            renderCell: params => renderStatusCell(params)
        },
        (props.canUpdate || props.canDelete) &&
        {
            field: "notLocked",
            sortable: false,
            filterable: false,
            headerName: "Actions",
            width: 120,
            disableClickEventBubbling: true,
            renderCell: params => renderActionsCell(params)
        },
    ]

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid rows={props.rows} columns={columns} pageSize={25} size="small"
                      allowColumnResizing={true} selection={{mode: 'single'}}/>
        </div>
    );
}

Usertable.propTypes = {
    rows: PropTypes.array.isRequired,
    edit: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    canUpdate: PropTypes.bool.isRequired,
    canDelete: PropTypes.bool.isRequired,
    username: PropTypes.string
}
export default Usertable;