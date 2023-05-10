import React, { useState, useEffect } from 'react';
import restApp, { authCookieName } from '../../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import ImageFrame from '../../../src/components/ImageFrame';
import useHandleError from '../../../src/hooks/useHandleError';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useUser} from "../../../src/store/UserContext";

const ResetPassword = () => {
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();
    const Router = useRouter();
    const [user, setUser] = useUser();

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (password.trim() !== confirmPassword.trim()) {
            setConfirmPasswordError('Confirm Password must be same as Password');
            return false;
        } else {
            setConfirmPasswordError('');
        }
        return true;
    };

    const resetPassword = async () => {
        if (validate()){
            try {
                setLoading(true);
                const res = await restApp.authenticate({
                    "password": password,
                    "strategy": "resetPassword"
                });
                setUser(res.user);
                localStorage.setItem(authCookieName, res.accessToken);
                enqueueSnackbar('Login Successful', {
                    variant: 'success',
                });
                await Router.push('/');
            } catch (error) {
                handleError()(error);
                setLoading(false);
            }
        }

    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setConfirmShowPassword(!confirmShowPassword);
    };

    const handleEnter = async (event) => {
        if (event.keyCode === 13) {
           await resetPassword();
        }
    };

    useEffect(async () => {
        if (user) {
           await Router.push('/');
        }
    }, []);

    return (
        <>
            <ImageFrame>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{
                    width: {sm:'90%', md: '70%'},
                    height:'100%'
                }}>
                    <Box sx={{
                        width: {xs:80, sm: 120},
                        marginBottom: {xs:2, sm: 2, md: 1},
                    }}>
                        <img alt="Login Logo" style={{
                            width: '100%',
                            height: 'auto'
                        }} src={'/images/logo.svg'} />
                    </Box>
                    <Typography variant="h5" >
                        Reset Password
                    </Typography>
                    <Box mt={1} />
                    <Typography variant="body2">
                        Set a new password for your account and confirm it.
                    </Typography>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <Typography>
                            {'Set Password'}
                        </Typography>
                        <TextField
                            size={'small'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            color={'primary'}
                            error={!!passwordError}
                            fullWidth
                            helperText={passwordError}
                            // label={'Password'}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={handleEnter}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            variant="outlined"
                        />
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <Typography>
                            {'Confirm Password'}
                        </Typography>
                        <TextField
                            size={'small'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowConfirmPassword}>
                                            {confirmShowPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            color={'primary'}
                            error={!!confirmPasswordError}
                            fullWidth
                            helperText={confirmPasswordError}
                            // label={'Password'}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            onKeyDown={handleEnter}
                            type={confirmShowPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            variant="outlined"
                        />
                    </Box>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                        <Button
                            fullWidth
                            color="primary"
                            disabled={loading ||password === ''|| confirmPassword === ''}
                            variant={'contained'}
                            onClick={resetPassword}
                        >
                            {loading ? <CircularProgress size={24} /> : 'RESET PASSWORD'}
                        </Button>
                    </Box>
                </Box>

            </ImageFrame>
        </>
    );
};

ResetPassword.layout = null;

export default ResetPassword;
