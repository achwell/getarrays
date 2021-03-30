import React from "react";
import PropTypes from 'prop-types';
import {Button, FormControl, Grid, TextField} from "@material-ui/core";
import Form, {useForm} from "../useForm";

export default function Employeeform(props) {

    const {values, setValues, handleInputChange} = useForm(props.initialValues);

    const save = () => {
        props.onSubmit(values);
    }

    return (
        <Form>
            <Grid container>
                <Grid item xs={6}>
                    <TextField variant="outlined" name="name" label="Name" value={values.name}
                               onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" type="email" name="email" label="Email" value={values.email}
                               onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" name="jobTitle" label="Job title" value={values.jobTitle}
                               onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" name="phone" label="Phone" value={values.phone}
                               onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" name="imageUrl" label="Image URL" value={values.imageUrl}
                               onChange={handleInputChange}/>
                </Grid>
            </Grid>
            <div>
                <Button variant="contained" color="primary" onClick={save}>{values.id ? "Update" : "Create"}</Button>
            </div>
        </Form>
    );
}
Employeeform.propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,

};