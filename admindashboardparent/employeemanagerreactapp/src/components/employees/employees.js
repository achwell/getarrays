import React from "react";
import './employees.css'
import {CellParams, DataGrid, GridApi, GridFooter} from "@material-ui/data-grid";
import {Button, TablePagination} from "@material-ui/core";
import {Modal} from "../modal/modal";
import employeeService from "../../api/employee.service";
import Employeeform from "../employeeform/employeeform";

class Employees extends React.Component {

    state = {
        employees: [],
        deleteOpen: false,
        editOpen: false,
        employee: undefined
    }

    add = () => {
        const employee = { id: null, name: null, email: null, jobTitle: null, phone: null, imageUrl: null };
        this.setState({editOpen: true, employee: employee});
    }

    edit = thisRow => {
        this.setState({editOpen: true, employee: thisRow});
    }

    delete = thisRow => {
        this.setState({deleteOpen: true, employee: thisRow});
    }

    toggleDeleteModal = e => {
        this.setState({deleteOpen: !this.state.deleteOpen});
    };

    toggleEditModal = e => {
        this.setState({editOpen: !this.state.editOpen});
    };

    deleteEmployee = async e => {
        await employeeService.delete('/' + this.state.employee.id);
        this.toggleDeleteModal();
        await this.getEmployees();
    }

    saveEmployee = async (employee) => {
        console.log({employee});
        employee.id
            ? await employeeService.put('/', employee)
            : await employeeService.post('/', employee);
        this.toggleEditModal();
        await this.getEmployees();
    }

    componentDidMount() {
        this.getEmployees();
    }

    getEmployees = async () => {
        const employees = await employeeService.get('/');
        this.setState({employees: employees.data});
    }

    render() {
        const columns = [
            {field: 'id', headerName: 'ID', width: 70},
            {field: 'employeeCode', headerName: 'employeeCode', width: 130},
            {field: 'name', headerName: 'Name', width: 200, editable: true},
            {field: 'jobTitle', headerName: 'jobTitle', width: 130, editable: true},
            {field: 'email', headerName: 'email', width: 200, editable: true},
            {field: 'phone', headerName: 'phone', width: 150, editable: true},
            {
                field: "edit",
                sortable: false,
                width: 100,
                disableClickEventBubbling: true,
                renderCell: (params: CellParams) => {
                    const onClick = () => {
                        const api: GridApi = params.api;
                        const fields = api
                            .getAllColumns()
                            .map((c) => c.field)
                            .filter((c) => c !== "__check__" && !!c);
                        const thisRow = {};
                        fields.forEach((f) => thisRow[f] = params.getValue(f));
                        return this.edit(thisRow);
                    };

                    return <span className="material-icons" onClick={onClick}>edit</span>;
                }
            },
            {
                field: "delete",
                sortable: false,
                width: 100,
                disableClickEventBubbling: true,
                renderCell: (params: CellParams) => {
                    const onClick = () => {
                        const api: GridApi = params.api;
                        const fields = api
                            .getAllColumns()
                            .map((c) => c.field)
                            .filter((c) => c !== "__check__" && !!c);
                        const thisRow = {};
                        fields.forEach((f) => thisRow[f] = params.getValue(f));
                        return this.delete(thisRow);
                    };
                    return <span className="material-icons" onClick={onClick}>delete</span>;
                }
            }
        ];
        return (
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={this.state.employees}
                    columns={columns}
                    pageSize={25} size="small"
                    allowColumnResizing={true}
                    selection={{mode: 'single'}}
                >
                    <GridFooter>
                        <TablePagination rowsPerPageOptions={[25, 50, 100]}/>
                    </GridFooter>
                </DataGrid>
                <span className="material-icons" onClick={this.add}>add</span>
                {this.state.employee &&
                <Modal
                    isOpen={this.state.deleteOpen}
                    handleClose={this.toggleDeleteModal}
                    title="Delete Employee"
                >
                    <div>
                        <p>Do you want to delete Employee: {this.state.employee.name}?</p>
                        <Button variant="contained" color="primary" onClick={this.deleteEmployee}>Delete</Button>
                        <Button variant="contained" color="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
                    </div>
                </Modal>
                }
                {this.state.employee &&
                <Modal
                    isOpen={this.state.editOpen}
                    handleClose={this.toggleEditModal}
                    title={this.state.employee.id ? "Update Employee" : "Create Employee"}
                >
                    <Employeeform initialValues={this.state.employee} onSubmit={this.saveEmployee}/>
                </Modal>
                }
            </div>
        )
    }
}

export default Employees;
