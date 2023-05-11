import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import CustomLayout from "../src/components/CustomLayout";
import {useEffect, useState} from "react";
import restApp, {authCookieName} from "../src/apis/rest.app";
import {useRouter} from "next/router";
import {SnackbarProvider} from "notistack";
import {UserProvider} from "../src/store/UserContext";
import {Grow} from "@mui/material";
import 'cropperjs/dist/cropper.css';
import createCustomTheme from "../src/theme";
import Loader from "../src/components/common/Loader";
import '../styles.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {

    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const [loading, setLoading] = useState(false);

    const Router = useRouter();

    const [user, setUser] = useState(null);


    let Layout = CustomLayout;

    if (Component.layout === null) Layout = React.Fragment;
    else if (Component.layout) Layout = Component.layout;
    const theme = createCustomTheme();

    useEffect(() => {

        const token = localStorage.getItem(authCookieName);
        console.log('hii');
        if (token) {
            console.log('no');

            setLoading(true);
            let navigator_info = window.navigator;
            let screen_info = window.screen;
            let uid = navigator_info.mimeTypes.length;
            uid += navigator_info.userAgent?.replace(/\D+/g, '');
            uid += navigator_info.plugins.length;
            uid += screen_info.height || '';
            uid += screen_info.width || '';
            uid += screen_info.pixelDepth || '';
            restApp
                .authenticate({
                    strategy: 'jwt',
                    accessToken: token,
                    "deviceId": uid + new Date(),
                    "deviceType": 1,
                },{query:{}})
                .then((response) => {

                    console.log("authentcate jwt:::::: =======>>>>>>", response)
                    const { accessToken } = response;
                    localStorage.setItem(authCookieName, accessToken);
                    setUser(response.user);
                    if (Router.pathname === '/login' || Router.pathname === '/forgot-password') {
                        Router.push('/').then(() => setLoading(false));
                    } else {
                        setLoading(false);
                    }
                })
                .catch(() => {
                    localStorage.removeItem(authCookieName);
                    restApp.logout();
                    Router.push('/login').then(() => setLoading(false));
                }).finally(() => setLoading(false));
        } else {
            console.log('bye');
            setLoading(true);
            if (!(Router.pathname === '/login' || Router.pathname === '/forgot-password')) {
                Router.push('/login').then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
    }, []);

    return (
        <CacheProvider value={emotionCache}>
            {/*<CustomThemeProvider value={setTheme}>*/}
                <Head>
                    <title>{'Platemate Partner'}</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <UserProvider value={[user,setUser]}>
                    <SnackbarProvider
                        maxSnack={3}
                        preventDuplicate
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        TransitionComponent={Grow}
                    >
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {loading ? <Loader /> :   <Layout>
                                <Component {...pageProps} />
                            </Layout>}

                            {/*</CustomLayout>*/}
                        </ThemeProvider>
                    </SnackbarProvider>
                </UserProvider>
            {/*</CustomThemeProvider>*/}
        </CacheProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};
