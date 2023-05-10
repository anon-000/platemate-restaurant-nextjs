import React from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";

const Loader = ({ text = 'Nothing to show', fontSize = '16px', fontWeight = 500 }) => {
    return (
        <Box
            alignItems={'center'}
            display={'flex'}
            flexDirection={'column'}
            fontSize={fontSize}
            fontWeight={fontWeight}
            justifyContent={'center'}
            height={300}
        >
            {text}
        </Box>
    );
};

Loader.propTypes = {
    text: PropTypes.string,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.number,
};

export default Loader;
