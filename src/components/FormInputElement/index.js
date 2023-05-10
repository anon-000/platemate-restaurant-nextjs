import React from 'react';
import {
    FLD_TYPE_AVATAR,
    FLD_TYPE_EMAIL,
    FLD_TYPE_NUMBER,
    FLD_TYPE_OPTION,
    FLD_TYPE_OPTION_MULTI,
    FLD_TYPE_PASSWORD,
    FLD_TYPE_PHONE,
    FLD_TYPE_SWITCH,
    FLD_TYPE_TEXT,
    FLD_TYPE_TEXTAREA,
} from '../../constants/field-types';
import FormPasswordElement from './FormPasswordElement';
import FormSwitchElement from './FormSwitchElement';
import FormAvatarElement from './FormAvatarElement';
import FormMultiOptionElement from './FormMultiOptionElement';
import FormOptionElement from './FormOptionElement';
import PropTypes from 'prop-types';
import {TextField} from "@mui/material";

const FormInputElement = ({ inputType, fullWidth = true, margin = 'normal', variant = 'outlined', ...props }) => {
    switch (inputType) {
        case FLD_TYPE_TEXT:
            return <TextField type="text" {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_EMAIL:
            return <TextField type="email" {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_TEXTAREA:
            return <TextField multiline rows={4} type="text" {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_NUMBER:
            return <TextField type="number" onWheel={e => e.target instanceof HTMLElement && e.target.blur()} {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_PHONE:
            return <TextField type="number" onWheel={e => e.target instanceof HTMLElement && e.target.blur()} {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_PASSWORD:
            return <FormPasswordElement {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_OPTION:
            return <FormOptionElement {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_OPTION_MULTI:
            return <FormMultiOptionElement {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_SWITCH:
            return <FormSwitchElement {...{ fullWidth, margin, variant, ...props }} />;
        case FLD_TYPE_AVATAR:
            return <FormAvatarElement {...{ fullWidth, margin, variant, ...props }} />;
    }
    return <div>{'Invalid Field Type'}</div>;
};

FormInputElement.propTypes = {
    inputType: PropTypes.any.isRequired,
    fullWidth: PropTypes.bool,
    margin: PropTypes.string,
    variant: PropTypes.string,
};

export default FormInputElement;
