import React, {useState} from "react";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import TabPanel from "../tabs/tabpanel";


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));


export default function TraceDetails(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {timestamp, timeTaken, request, response} = props.trace;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Request" {...a11yProps(0)} />
                    <Tab label="Response" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} label="Request">
                <div>
                    <p>
                        <strong>Time Stamp:</strong>
                        {timestamp.toLocaleString()}
                    </p>
                    <p>
                        <strong>Time Taken(ms):</strong>
                        {timeTaken}
                    </p>
                    <p>
                        <strong>Request Method:</strong>
                        {request.method}
                    </p>
                    <p>
                        <strong>Remote Address:</strong>
                        {request.remoteAddress}
                    </p>
                    <p>
                        <strong>URI:</strong>
                        {request.uri}
                    </p>
                    <p>
                        <strong>Origin:</strong>
                        {request.headers['origin']}
                    </p>
                    <p>
                        <strong>User Agent (Web Client):</strong>
                        {request.headers['user-agent']}
                    </p>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1} label="Response">
                <div>
                    <dl>
                        <dt>Status:</dt>
                        <dd>{response.status}</dd>
                    </dl>
                    <dl>
                        <dt>Date:</dt>
                        <dd>{response.headers['Date']}</dd>
                    </dl>
                    <dl>
                        <dt>Content Type:</dt>
                        <dd>{response.headers['Content-Type']}</dd>
                    </dl>
                    <p>
                        <strong>Server Allowed Origins:</strong>
                        {response.headers['Access-Control-Allow-Origin']}
                    </p>
                </div>
            </TabPanel>
        </div>
    );
};
