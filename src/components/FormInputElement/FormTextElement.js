import React from 'react';
import {TextField} from "@mui/material";

const FormTextElement = (props) => {
    return <TextField autoFocus fullWidth label="Email Address" margin="dense" type="email" {...props} />;
};

export default FormTextElement;
