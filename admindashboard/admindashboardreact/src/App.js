import React from 'react';

import Systemstatusbar from "./components/systemstatusbar/systemstatusbar";
import Traces from "./components/traces/traces";
import actuatorService from "./api/actuator.service";

const INITIAL_STATE = {
    systemStatus: 'DOWN',
    dbStatus: 'DOWN',
    systemHealth: {},
    systemCpu: 0,
    timestamp: 0,
    http200Traces: [],
    http400Traces: [],
    http404Traces: [],
    http500Traces: [],
    httpDefaultTraces: [],
    httpTraces: []
};

class App extends React.Component {

    state = INITIAL_STATE

    componentDidMount() {
        this.reloadData();
    }

    reloadData = async () => {
        const {systemStatus, dbStatus, diskSpace} = await this.getSystemHealth();
        const timestamp = await this.getProcessUpTime();
        const systemCpu = await this.getSystemCPU();
        const {
            http200Traces,
            http400Traces,
            http404Traces,
            http500Traces,
            httpDefaultTraces,
            httpTraces
        } = await this.getTraces();
        this.setState({
            systemStatus,
            dbStatus,
            diskSpace,
            timestamp,
            systemCpu,
            http200Traces,
            http400Traces,
            http404Traces,
            http500Traces,
            httpDefaultTraces,
            httpTraces
        });
    }

    getSystemHealth = async () => {
        let {systemStatus, dbStatus, diskSpace} = INITIAL_STATE;
        const response = await actuatorService.get("/health").catch(

        );
        const systemHealth = response.data;
        const dbComponent = systemHealth.components.db;
        const diskSpaceComponent = systemHealth.components.diskSpace;

        systemStatus = systemHealth.status;
        dbStatus = `${dbComponent.details.database} - ${dbComponent.status}`;
        diskSpace = diskSpaceComponent.details.free;
        return {systemStatus, dbStatus, diskSpace};
    }

    getProcessUpTime = async () => {
        const response = await actuatorService.get("/metrics/process.uptime");
        return response.data.measurements[0].value;
    }

    getSystemCPU = async () => {
        const response = await actuatorService.get("/metrics/system.cpu.count");
        return response.data.measurements[0].value;
    }

    getTraces = async () => {
        const response = await actuatorService.get("/httptrace");
        let http200Traces = [];
        let http400Traces = [];
        let http404Traces = [];
        let http500Traces = [];
        let httpDefaultTraces = [];
        let httpTraces = [];
        let traceList = response.data.traces.filter(trace => !trace.request.uri.includes('actuator'));
        let i = 0;

        traceList.forEach(trace => {
            let t = {...trace};
            t.id = i++;
            t.timestamp = new Date(trace.timestamp);
            t.timeTaken = trace.timeTaken;
            t.method = trace.request.method;
            t.uri = trace.request.uri;
            t.status = trace.response.status;
            httpTraces.push(t);
            switch (trace.response.status) {
                case 200:
                    http200Traces.push(trace);
                    break;
                case 400:
                    http400Traces.push(trace);
                    break;
                case 404:
                    http404Traces.push(trace);
                    break;
                case 500:
                    http500Traces.push(trace);
                    break;
                default:
                    httpDefaultTraces.push(trace);
            }
        });

        return {http200Traces, http400Traces, http404Traces, http500Traces, httpDefaultTraces, httpTraces};
    }

    render() {
        return (
            <div className="App">
                {
                    this.state.timestamp && <Systemstatusbar
                        systemStatus={this.state.systemStatus}
                        dbStatus={this.state.dbStatus}
                        diskSpace={this.state.diskSpace}
                        systemCpu={this.state.systemCpu}
                        timestamp={this.state.timestamp}
                        refresh={this.reloadData}/>
                }
                {
                    this.state.httpTraces.length > 0 && <Traces
                        http200Traces={this.state.http200Traces}
                        http400Traces={this.state.http400Traces}
                        http404Traces={this.state.http404Traces}
                        http500Traces={this.state.http500Traces}
                        httpDefaultTraces={this.state.httpDefaultTraces}
                        httpTraces={this.state.httpTraces}
                    />
                }
            </div>
        );
    }
}

export default App;
