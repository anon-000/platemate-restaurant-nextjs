import React from 'react';
import PropTypes from 'prop-types';
import {Box, CircularProgress} from "@mui/material";

/**
 * @description Circular progress loader
 * @param {number} size
 * @param {string} btnType
 * @returns {JSX.Element}
 * @constructor
 */
const CircularProgressLoader = ({ size, btnType }) => {
    const getSIze = () => {
        if (size) {
            return size;
        } else if (btnType === 'small') {
            return 18;
        } else if (btnType === 'medium') {
            return 19;
        } else if (btnType === 'large') {
            return 19;
        } else {
            return 18;
        }
    };

    return (
        <Box display={'flex'} height={'100%'} m={0.4} px={btnType === 'large' ? 0.2 : 0}>
            <CircularProgress size={getSIze()} />
        </Box>
    );
};

CircularProgressLoader.propTypes = {
    btnType: PropTypes.string,
    size: PropTypes.number,
};
export default CircularProgressLoader;
