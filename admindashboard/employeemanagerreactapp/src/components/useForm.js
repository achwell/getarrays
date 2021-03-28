import React, {useState} from 'react';
import {makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    }
}));

export function useForm(initialValues) {

    const [values, setValues] = useState(initialValues);

    const handleInputChange = e => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    return {
        values,
        setValues,
        handleInputChange
    };
}

export default function Form(props) {
    const classes = useStyles();
    return (
        <Paper className={classes.pageContent}>
            <form className={classes.root}>
                {props.children}
            </form>
        </Paper>
    );
}