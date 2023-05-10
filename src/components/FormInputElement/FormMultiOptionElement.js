import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {Autocomplete, TextField} from "@mui/material";

const FormMultiOptionElement = ({ fullWidth, margin, variant, options, onChange, value, ...props }) => {
	useEffect(() => {
		if (!value && options && Array.isArray(options)) {
			const value = options.filter((each) => each.default);
			if (value) {
				onChange({ target: { value: value } });
			}
		}
	}, []);

	return (
		<Autocomplete
			defaultValue={value ? value : options.filter((each) => each.default)}
			filterOptions={(options) =>
				options.filter(
					(each) =>
						!(
							value &&
							value.find((eachValue) =>
								eachValue.label || each.label ? eachValue.label === each.label : eachValue.value === each.value,
							)
						),
				)
			}
			filterSelectedOptions
			getOptionLabel={(option) => option.label}
			multiple
			onChange={(event, updatedValue) => onChange({ target: { value: updatedValue } })}
			options={options}
			renderInput={(params) => <TextField {...{ fullWidth, margin, variant, ...props }} {...params} />}
		/>
	);
};

FormMultiOptionElement.propTypes = {
	inputType: PropTypes.string.isRequired,
	fullWidth: PropTypes.bool,
	margin: PropTypes.string,
	variant: PropTypes.string,
	options: PropTypes.array,
	onChange: PropTypes.func,
	label: PropTypes.string,
	value: PropTypes.array,
};

FormMultiOptionElement.defaultProps = {
	fullWidth: true,
	margin: 'normal',
	variant: 'outlined',
	options: [],
	onChange: () => {},
};

export default FormMultiOptionElement;
