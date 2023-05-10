import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const CustomThemeContext = createContext( () => {});

CustomThemeContext.displayName = 'CustomTheme';

export const CustomThemeProvider = ({ value, children }) => {

    return <CustomThemeContext.Provider value={value}>{children}</CustomThemeContext.Provider>;
};

CustomThemeProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useCustomTheme = () => useContext(CustomThemeContext);
