import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from "prop-types";

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
    const [open, setOpen] = useState(true);

    if(!props.message) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Collapse in={open}>
                <Alert variant="filled" severity={props.severity} action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }>
                    {props.message}
                </Alert>
            </Collapse>
        </div>
    );
}
Notification.propTypes = {
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error'])
}
export default Notification;