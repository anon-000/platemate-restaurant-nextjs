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
import theme from "../../../src/theme";

const GetOtp = () => {
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();
    const Router = useRouter();
    const { redirectUrl } = Router.query;
    const [user, setUser] = useUser();

    const [email, setEmail] = React.useState('admin@gmail.com');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('12345678');
    const [passwordError, setPasswordError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (email.trim() === '') {
            setEmailError('Email is required!');
            return false;
        } else {
            setEmailError('');
        }
        if (
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email,
            )
        ) {
            setEmailError('');
        } else {
            setEmailError('Please enter a valid email!');
            return false;
        }
        if (password.trim() === '') {
            setPasswordError('Password is required');
            return false;
        } else {
            setPasswordError('');
        }
        return true;
    };

    const sendOtp = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const res = await restApp.authenticate({
                    strategy: 'emailOtp',
                    email,
                    "action": "forgotPassword",
                });
                enqueueSnackbar('Otp sent Successful', {
                    variant: 'success',
                });
                localStorage.setItem('email', email);
                await Router.push('/forget-password/verify-otp')
            } catch (error) {
                handleError()(error);
                setLoading(false);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            sendOtp();
        }
    };

    useEffect(() => {
        if (user) {
            Router.push('/');
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
                        Forgot Password
                    </Typography>
                    <Box mt={1} />
                    <Typography variant="body2">
                        You will get a OTP on your registered email ID.
                        Please enter your registered email ID for the verification process.
                    </Typography>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <Typography>
                            {'Email'}
                        </Typography>
                        <TextField
                            size={'small'}
                            autoFocus
                            color="primary"
                            error={!!emailError}
                            fullWidth
                            helperText={emailError}
                            // label={'Email'}
                            onChange={(event) => setEmail(event.target.value)}
                            onKeyDown={handleEnter}
                            type={'email'}
                            value={email}
                            variant="outlined"
                        />
                    </Box>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                        <Button
                            fullWidth
                            color="primary"
                            disabled={loading}
                            onClick={async ()=>{await sendOtp();}}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'GET OTP'}
                        </Button>
                    </Box>
                </Box>

            </ImageFrame>
        </>
    );
};

GetOtp.layout = null;

export default GetOtp;
