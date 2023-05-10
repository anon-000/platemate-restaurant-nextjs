import React from 'react';
import PropTypes from 'prop-types';
import {Box, Hidden} from "@mui/material";

const ImageFrame = ({ children }) => {

    return (
        <Box sx={{
            background: "url(/images/Login-background-image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F57C3D"

        }}>

            <Box sx={{
                background: "white",
                height: "80vh",
                width: "80vw",
                boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.25)",
                borderRadius: "8px"
            }}>
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                }}>
                    <Hidden smDown>
                        <Box sx={{
                            display: 'flex',
                            position:'relative',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(252,229,195,0.1)',
                            backgroundSize: 'cover',
                            flex: '110'
                        }}>
                            <img
                                alt={'student-image'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover',borderRadius:'10px 0px 0px 10px'}}
                                src={'/images/kut.jpeg'}
                            />
                        </Box>
                    </Hidden>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: '110',
                    }}>{children}</Box>
                </Box>
            </Box>
        </Box>
    );
};

ImageFrame.propTypes = {
    children: PropTypes.element.isRequired,
};

export default ImageFrame;
