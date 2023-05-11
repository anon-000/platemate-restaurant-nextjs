import React, { useState, useEffect } from 'react';
import restApp, { authCookieName } from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import ImageFrame from '../../src/components/ImageFrame';
import useHandleError from '../../src/hooks/useHandleError';
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
import {useUser} from "../../src/store/UserContext";
import theme from "../../src/theme";

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();
    const Router = useRouter();
    const { redirectUrl } = Router.query;
    const [user, setUser] = useUser();

    const [email, setEmail] = React.useState('bonfire@gmail.com');
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

    const handleLogin = async () => {
        if (validate()) {
            try {
                setLoading(true);
                let navigator_info = window.navigator;
                let screen_info = window.screen;
                let uid = navigator_info.mimeTypes.length;
                uid += navigator_info.userAgent?.replace(/\D+/g, '');
                uid += navigator_info.plugins.length;
                uid += screen_info.height || '';
                uid += screen_info.width || '';
                uid += screen_info.pixelDepth || '';
                const res = await restApp.authenticate({
                    strategy: 'local',
                    email,
                    password,
                    "deviceId": uid + new Date(),
                    "deviceType": 1
                },{query:{}});
                setUser(res.user);
                localStorage.setItem(authCookieName, res.accessToken);
                enqueueSnackbar('Login Successful', {
                    variant: 'success',
                });
                Router.push(redirectUrl ? String(redirectUrl) : '/').then(() => {
                    setLoading(false);
                });
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
            handleLogin();
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
                    <Typography sx={{fontWeight:500,fontSize:'20px'}}>
                        Partner Login
                    </Typography>
                    <Box mt={1} />
                    <Typography variant="body2">
                        Enter the login credentials to login to your account.
                    </Typography>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <Typography sx={{fontWeight:600,fontSize:'12px'}}>
                            {'Email ID'}
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
                            placeholder={'enter your email ID'}
                            variant="outlined"
                        />
                    </Box>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <Typography sx={{fontWeight:600,fontSize:'12px'}}>
                            {'Password'}
                        </Typography>
                        <TextField
                            size={'small'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <img src={'/images/icons/eye_open.svg'} alt={'Eye open'} /> : <img src={'/images/icons/eye_closed.svg'} alt={'eye off'} />}
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
                            placeholder={'password'}
                        />
                    </Box>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                        <Button
                            fullWidth
                            color="primary"
                            disabled={loading}
                            onClick={handleLogin}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Box>
                    <Typography sx={{mt:1}}>
                        Forgot your password?
                        <span style={{color:'#508CD2',cursor:'pointer'}} onClick={async () =>{await Router.push('/forget-password/get-otp')}}>
                            {' Reset Password'}
                        </span>
                    </Typography>
                </Box>

            </ImageFrame>
        </>
    );
};

Login.layout = null;

export default Login;
