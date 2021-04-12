import React from 'react';
import TypoGraphy from '@material-ui/core/Typography'
import actuatorService from "../../service/actuator.service";
import authenticationService from "../../service/autehentication.service";

const INITIAL_STATE = {
    systemStatus: 'DOWN',
    dbStatus: 'DOWN',
    systemHealth: {},
    systemCpu: 0,
    timestamp: 0
};

class Systemstatus extends React.Component {

    state = INITIAL_STATE

    componentDidMount() {
        this.reloadData(true);
    }

    componentWillUnmount() {

    }

    updateTime = () => {
        setInterval(() => {
            this.setState((prevState, props) => ({timestamp: prevState.timestamp + 1}));
        }, 1000);
    }

    reloadData = async (updateTime) => {
        const {systemStatus, dbStatus, diskSpace} = await this.getSystemHealth();
        const timestamp = await this.getProcessUpTime();
        const systemCpu = await this.getSystemCPU();
        this.setState({systemStatus, dbStatus, diskSpace, timestamp, systemCpu});
        if(updateTime) {
            this.updateTime();
        }
    }

    getSystemHealth = async () => {
        let {systemStatus, dbStatus, diskSpace} = INITIAL_STATE;
        const response = await actuatorService.getSystemHealth().catch();
        const systemHealth = response.data;
        const dbComponent = systemHealth.components.db;
        const diskSpaceComponent = systemHealth.components.diskSpace;

        systemStatus = systemHealth.status;
        dbStatus = `${dbComponent.details.database} - ${dbComponent.status}`;
        diskSpace = diskSpaceComponent.details.free;
        return {systemStatus, dbStatus, diskSpace};
    }

    getProcessUpTime = async () => {
        const response = await actuatorService.getProcessUpTime().catch();
        return response.data.measurements[0].value;
    }

    getSystemCPU = async () => {
        const response = await actuatorService.getSystemCPU().catch();
        return response.data.measurements[0].value;
    }

    formatBytes = bytes => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = 2 < 0 ? 0 : 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formateUptime = timestamp => {
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - (hours * 60);
        const seconds = Math.round(timestamp % 60);
        return hours.toString().padStart(2, '0') + 'h ' + minutes.toString().padStart(2, '0') + 'm ' + seconds.toString().padStart(2, '0') + 's';
    }

    render() {
        if(!authenticationService.hasPrivilege("systemstatus")) {
            return null;
        }
        return (
            <>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    System: {this.state.systemStatus}
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    DB: {this.state.dbStatus}
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Disk Space: {this.formatBytes(this.state.diskSpace)}
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Processors: {this.state.systemCpu}
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Up Time: {this.formateUptime(this.state.timestamp)}
                </TypoGraphy>
            </>
        );
    }
}

export default Systemstatus;
