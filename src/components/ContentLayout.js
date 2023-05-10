import React from 'react';
import PropTypes from 'prop-types';
import {Box, Paper} from "@mui/material";

function Content(props) {
    const { children, action, actionElement } = props;

    return (
        <Paper>
            {(action || actionElement) && (
                <Box width={'100%'}>
                    {actionElement ? (
                        actionElement
                    ) : (
                        <></>
                    )}
                </Box>
            )}
            <Box p={2}>
                {children}
            </Box>
        </Paper>
    );
}

Content.propTypes = {
    children: PropTypes.any.isRequired,
    action: PropTypes.any,
    actionElement: PropTypes.any,
};

export default Content;
