import {createTheme} from '@mui/material/styles';

const createCustomTheme = (primary = '#F57C3D') => {
  // Create a theme instance.
  return createTheme({
    palette: {
      type: 'light',
      common: {
        black: '#000',
        white: '#fff',
        gray: '#DADADA',
      },
      primary: {
        main: primary,
      },
      secondary: {
        main: '#ff0b0b',
      },
      text: {
        primary: '#515c6f',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
        other: '#757575',
      },
      other: {
        subTextColor: '#878787',
        backgroundMenuColor: '#e9f5ff',
        textField: '#eeeeee',
      },
      background: {
        paper: '#ffffff',
        default: '#ffffff',
        other: '#F3F3F3',
        drawer: 'rgba(3, 127, 251, 0.05)',
        common: '#FFF5F5',
        strike: '#C6C6C6',
        secondary: '#2F415E',
        text: '#9A9A9A',
        upload: '#EEF7FF',
        cropper: '#EEF7FF',
      },
      divider: '#E6E7EF',
      divider2: 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      button: {
        textTransform: 'capitalize',
      },
    },
    shape: {
      borderRadius: 6,
    },
    props: {
      MuiTab: {
        disableRipple: true,
      },
    },
    mixins: {
      toolbar: {
        minHeight: 48,
      },
    },
  });
};

export default createCustomTheme;
