import React from 'react';

class Systemstatusbar extends React.Component {

    state = {timestamp: this.props.timestamp};

    componentDidMount() {
        this.updateTime();
    }

    reloadData = () => {
        if (this.props.refresh) {
            this.props.refresh();
        }
    }

    formateUptime = timestamp => {
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - (hours * 60);
        const seconds = Math.round(timestamp % 60);
        return hours.toString().padStart(2, '0') + 'h ' + minutes.toString().padStart(2, '0') + 'm ' + seconds.toString().padStart(2, '0') + 's';
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

    updateTime = () => {
        setInterval(() => {
            this.setState((prevState, props) => ({timestamp: prevState.timestamp + 1}));
        }, 1000);
    }

    render() {
        return (
            <nav>
                <div>
                    <ul>
                        <li>
                            <span>
                                <i className="material-icons icon-image-preview">storage</i>
                                System: {this.props.systemStatus}
                            </span>
                        </li>
                        <li>
                            <span>
                                <i className="material-icons icon-image-preview"></i>
                                DB: {this.props.dbStatus}
                            </span>
                        </li>
                        <li>
                            <span>
                                <i className="material-icons icon-image-preview"></i>
                                Disk Space: {this.formatBytes(this.props.diskSpace)}
                            </span>
                        </li>
                        <li>
                            <span>
                                <i className="material-icons icon-image-preview"></i>
                                Processors: {this.props.systemCpu}
                            </span>
                        </li>
                        <li>
                            <span>
                                <i className="material-icons icon-image-preview"></i>
                                Up Time: {this.formateUptime(this.state.timestamp)}
                            </span>
                        </li>
                    </ul>
                    <div>
                        <button onClick={() => this.reloadData()}> Refresh Data</button>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Systemstatusbar;