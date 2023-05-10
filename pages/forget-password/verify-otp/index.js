import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import ImageFrame from '../../../src/components/ImageFrame';
import {
    Box,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {useRouter} from "next/router";
import OtpInput from "react-otp-input";
import restApp, {authCookieName, AuthenticationService} from "../../../src/apis/rest.app";
import useHandleError from "../../../src/hooks/useHandleError";

const useStyles = makeStyles((theme) => ({
    otpBox: {

    },
    link: {
        color: theme.palette.primary.main,
        cursor: "pointer",
    },
    resendOtp: {
        marginLeft: 10,
        color:'#005299',
        fontWeight:600,
    }
}));

const VerifyOtp = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [OTP, setOTP] = useState('');
    const [time, setTime] = React.useState(30);
    const [timeLoading, setTimeLoading] = useState(false);
    const Router = useRouter();
    const handleError = useHandleError();

    const sendOtpToMail = async () => {
        try {
            const email = localStorage.getItem('email');
            setLoading(true);
            const res = await restApp.authenticate({
                strategy: 'emailOtp',
                email,
                "action": "forgotPassword",
            });
            enqueueSnackbar('Otp sent Successful', {
                variant: 'success',
            });
            await Router.push('/forget-password/verify-otp');
        } catch (error) {
            handleError()(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (time > 0){
            setTimeout(function () {
                setTime(time - 1);
            }, 1000);
        }
    }, [time]);

    const verifyOtp = () =>{
        const email = localStorage.getItem('email');
        AuthenticationService.patch(null, {
            "email": email,
            "strategy": "emailOtp",
            "action": "forgotPassword",
            "otp": OTP
        }).then(async () => {
            enqueueSnackbar('OTP verified successful', {
                variant: 'success',
            });
            await Router.push('/forget-password/reset-password');
        }).catch((e) => {
            enqueueSnackbar(e ? e.message : 'Something went wrong', {
                variant: 'error',
            });
        });
    };

    return (
        <>
            <ImageFrame>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{
                    width: {sm:'90%', md: '70%'},
                    height:'100%'
                }}>
                    <Box sx={{
                        width: {xs:80, sm: 120},
                        marginBottom: {xs:2, sm: 2, md: 0},
                    }}>
                        <img alt="Login Logo" style={{
                            width: '100%',
                            height: 'auto'
                        }} src={'/images/logo.svg'} />
                    </Box>
                    <Typography variant="h6" >
                        Verify OTP
                    </Typography>
                    <Box mt={1} />
                    <Typography variant="body2">
                        {'Please enter the OTP that has been sent to your given Email ID '}
                        {/*<span className={classes.link} style={{cursor: 'pointer'}} onClick={() => {*/}
                        {/*    setCurrentStage(0);*/}
                        {/*}}>Change</span>*/}
                        {/* {email.indexOf('@')} */}
                    </Typography>
                    <Box mt={4.5} />
                    <Box display="flex" justifyContent="center" alignItems={'center'}>
                        <OtpInput
                            errorStyle="error"
                            focusStyle={
                                {border: '1px solid #005299'}
                            }
                            hasErrored={false}
                            inputStyle={{
                                    color: 'black',
                                    width: 85,
                                    height: 40,
                                    borderRadius: '10px',
                                    border: `1px solid #fff`,
                                    boxShadow: 'inset 4px 4px 12px rgba(0, 0, 0, 0.08)',
                                }}
                            isDisabled={false}
                            isInputNum={false}
                            numInputs={4}
                            onChange={(otp) => {
                                setOTP(otp);
                                if (otp.length === 4) {
                                    const email = localStorage.getItem('email');
                                    AuthenticationService.patch(null, {
                                        "email": email,
                                        "strategy": "emailOtp",
                                        "action": "forgotPassword",
                                        "otp": otp
                                    }).then(async () => {
                                        enqueueSnackbar('OTP verified successful', {
                                            variant: 'success',
                                        });
                                        await Router.push('/forget-password/reset-password');
                                    }).catch((e) => {
                                        enqueueSnackbar(e ? e.message : 'Something went wrong', {
                                            variant: 'error',
                                        });
                                    });
                                }
                            }}
                            separator={<Box width="25px" />}
                            shouldAutoFocus
                            value={OTP}
                        />
                    </Box>
                    <Box textAlign={'center'} mt={3}>
                        <Typography textAlign={'center'} sx={{color:'#666666'}}>
                            {time !== 0 ? time <10 ?'00:0'+time :'00:'+time : ''}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems={'center'} justifyContent="center" mt={2}>
                        <Typography variant={'body2'}>
                            Didn’t got the OTP?
                        </Typography>
                        <Button disabled={time !== 0 } className={classes.resendOtp} size={'small'} onClick={()=>{
                            setOTP('');
                            sendOtpToMail();
                        }}>
                            {timeLoading ? <CircularProgress size={22} /> : 'RESEND OTP'}
                        </Button>
                    </Box>
                    <Box mt={1} />
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                        <Button
                            fullWidth
                            color="primary"
                            disabled={loading ||OTP === ''}
                            onClick={async ()=>{await verifyOtp();}}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'VERIFY OTP'}
                        </Button>
                    </Box>
                </Box>
            </ImageFrame>
        </>
    );
};

VerifyOtp.layout = null;

export default VerifyOtp;
