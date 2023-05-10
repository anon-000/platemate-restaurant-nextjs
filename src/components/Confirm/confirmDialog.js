import React from 'react';
import { confirmable } from 'react-confirm';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ThemeProvider,
    Typography
} from "@mui/material";
import createCustomTheme from "../../theme";

const ConfirmDialog = ({
    okLabel,
    cancelLabel = 'Cancel',
    title,
    confirmation,
    show,
    proceed,
    dismiss,
    cancel,
    content,
}) => {

    return (
        <ThemeProvider theme={createCustomTheme()}>
            <Dialog fullWidth maxWidth="xs" onClose={dismiss} open={show}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'body2'}>{confirmation}</Typography>
                    </DialogContentText>
                    <Typography>{content && <DialogContentText>{content}</DialogContentText>}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={cancel}>
                        {cancelLabel}
                    </Button>
                    <Button color="primary" onClick={proceed} variant={'contained'} sx={{color: 'white'}}>
                        {okLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>

    );
};

ConfirmDialog.propTypes = {
    okLabel: PropTypes.any.isRequired,
    cancelLabel: PropTypes.any,
    title: PropTypes.any.isRequired,
    confirmation: PropTypes.any.isRequired,
    show: PropTypes.bool.isRequired,
    proceed: PropTypes.func.isRequired,
    dismiss: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    content: PropTypes.any,
    primary: PropTypes.any,
};

export default confirmable(ConfirmDialog);
