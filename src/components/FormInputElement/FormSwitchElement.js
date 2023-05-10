import React from 'react';
import PropTypes from 'prop-types';
import {FormControlLabel, Switch} from "@mui/material";

const FormSwitchElement = ({ value, onChange, label, labelPlacement, required, ...props }) => {
	return (
		<FormControlLabel
			control={
				<Switch
					{...props}
					checked={value}
					onChange={(e, value) => {
						// e.target.value = value;
						onChange({ target: { ...e.target, value } });
					}}
					required={required}
				/>
			}
			label={required ? `${label} *` : label}
			labelPlacement={labelPlacement}
			// value="start"
		/>
	);
};

FormSwitchElement.propTypes = {
	value: PropTypes.bool,
	onChange: PropTypes.func,
	label: PropTypes.string,
	labelPlacement: PropTypes.string,
	required: PropTypes.bool,
};

FormSwitchElement.defaultProps = {
	value: false,
	onChange: () => {},
	label: '',
	labelPlacement: 'start',
	required: false,
};

export default FormSwitchElement;
