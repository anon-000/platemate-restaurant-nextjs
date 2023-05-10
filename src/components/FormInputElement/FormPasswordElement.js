import React from 'react';
import PropTypes from 'prop-types';
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const FormPasswordElement = (props) => {
	const [showPassword, setShowPassword] = React.useState(props.showPassword);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<TextField
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton disabled={props.disabled} onClick={handleClickShowPassword}>
							{showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				),
			}}
			type={showPassword ? 'text' : 'password'}
			{...props}
		/>
	);
};

FormPasswordElement.propTypes = {
	showPassword: PropTypes.bool,
	disabled: PropTypes.bool,
};

FormPasswordElement.defaultProps = {
	showPassword: false,
	disabled: false,
};

export default FormPasswordElement;
