import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {MenuItem, TextField} from "@mui/material";

const FormOptionElement = ({ fullWidth, margin, variant, options, value, ...props }) => {
	useEffect(() => {
		if (!value && options && Array.isArray(options)) {
			const value = options.find((each) => each.default);
			if (value) {
				props.onChange({ target: { value: value.value } });
			}
		}
	}, []);

	return (
		<TextField select {...{ fullWidth, margin, variant, value, ...props }}>
			{options?.map(({ value, label, ...props }) => (
				<MenuItem key={value} value={value} {...props}>
					{label || value}
				</MenuItem>
			))}
		</TextField>
	);
};

FormOptionElement.propTypes = {
	inputType: PropTypes.string.isRequired,
	fullWidth: PropTypes.bool,
	margin: PropTypes.string,
	variant: PropTypes.string,
	options: PropTypes.array,
	onChange: PropTypes.func,
	label: PropTypes.string,
	value: PropTypes.array,
};

FormOptionElement.defaultProps = {
	fullWidth: true,
	margin: 'normal',
	variant: 'outlined',
	options: [],
	onChange: () => {},
};

export default FormOptionElement;
