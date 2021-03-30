import React from 'react';

import {Bar, Pie} from 'react-chartjs-2';
import {DataGrid} from "@material-ui/data-grid";
import {Modal} from "../modal/modal";
import TraceDetails from "../tracedetails/tracedetails";

class Traces extends React.Component {

    state = {
        viewOpen: false,
        row: {}
    }

    toggleViewModal = e => {
        this.setState({viewOpen: !this.state.viewOpen});
    };

    view = row => {
        this.setState({viewOpen: true, row});
    }

    render() {
        const data = {
            labels: ['200', '404', '400', '500'],
            datasets: [{
                data: [this.props.http200Traces.length, this.props.http404Traces.length, this.props.http400Traces.length, this.props.http500Traces.length],
                backgroundColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
                borderColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
                borderWidth: 3
            }]
        };
        const options = {
            legend: {display: true}
        };

        const columns = [
            {field: 'timestamp', headerName: 'Time Stamp', width: 260, type: 'dateTime'},
            {field: 'method', headerName: 'Method'},
            {field: 'timeTaken', headerName: 'Time Taken(ms)', type: 'number', width: 175},
            {field: 'status', headerName: 'Status', renderCell: (params: GridCellParams) => (
                    <span className={params.value}>
                        {params.value}
                    </span>
                )
            },
            {field: 'uri', headerName: 'URI', width: 325},
            {
                field: "view",
                sortable: false,
                width: 50,
                disableClickEventBubbling: true,
                renderCell: (params: CellParams) => {
                    const onClick = () => {
                        return this.view(params.row);
                    };
                    return <span className="material-icons link" onClick={onClick}>storage</span>;
                }
            },
        ]
        return (
            <div>
                <Pie data={data} options={options} width={100} height={50}/>
                <Bar data={data} options={{maintainAspectRatio: false, legend: {display: false}}} width={100}
                     height={50}/>
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={this.props.httpTraces}
                        columns={columns}
                        pageSize={25} size="small"
                        allowColumnResizing={true}
                        selection={{mode: 'single'}}
                    >
                    </DataGrid>
                </div>
                <Modal
                    isOpen={this.state.viewOpen}
                    handleClose={this.toggleViewModal}
                    title="HTTP Trace Details"
                >
                    <TraceDetails trace={this.state.row}/>
                </Modal>

            </div>
        );
    }
}

export default Traces;


