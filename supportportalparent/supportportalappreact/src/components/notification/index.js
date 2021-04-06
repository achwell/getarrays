import React from 'react';
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function Notification(props) {

    const classes = useStyles();

    return !props.message ? null : (
        <div className={classes.root}>
            <Alert variant="filled" severity={props.severity}>
                {props.message}
            </Alert>
        </div>
    );
}
Notification.propTypes = {
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error'])
}
export default Notification;