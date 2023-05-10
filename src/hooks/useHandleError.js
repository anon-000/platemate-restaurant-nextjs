import { useSnackbar } from 'notistack';

const useHandleError = () => {
    const { enqueueSnackbar } = useSnackbar();
    return (defaultMessage = 'Something went wrong') => (error) => {
        enqueueSnackbar(error.message ? error.message : defaultMessage, { variant: 'error' });
    };
};

export default useHandleError;
