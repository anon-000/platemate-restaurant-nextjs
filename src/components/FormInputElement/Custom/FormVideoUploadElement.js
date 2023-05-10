import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadFile } from '../../../apis/rest.app';
import useHandleError from '../../../hooks/useHandleError';
import Box from "@mui/material/Box";
import {Chip, Typography} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import {useTheme} from "@mui/material/styles";

const FormFileUploadElement = ({ label, selected, setSelected }) => {
    const handleError = useHandleError();
    const theme = useTheme();
    const inputRef = React.useRef();

    const handleDelete = () => {
        setSelected('');
    };

    const handleClickOpen = () => {
        inputRef.current.click();
    };

    const handlePdfUpload = async (event) => {
        const file = event.target.files[0];
        // const url = URL.createObjectURL(file);
        // console.log('url',url);
        if (file) {
            let _video;
            await uploadFile(file)
                .then((res) => {
                    _video = res?.path;
                    setSelected(_video);
                })
                .catch((error) => {
                    handleError()(error);
                });
        }
    };
    return (
        <Box spacing={1}>
            {/*<Typography variant={'body2'}>{label}</Typography>*/}
            <Box display={'flex'} flexWrap={'wrap'} width={'100%'}>
                {selected === '' || selected === undefined ? (
                    // <Box
                    //     alignItems={'center'}
                    //     bgcolor={'#F7E2FF'}
                    //     borderRadius={'50%'}
                    //     display={'flex'}
                    //     justifyContent={'center'}
                    //     onClick={handleClickOpen}
                    //     p={1.2}
                    //     style={{ cursor: 'pointer' }}
                    // >
                    //     <VideoLibraryIcon style={{ color: '#5C3F87' }} />
                    // </Box>
                    <Box
                        alignItems="center"
                        bgcolor={'#EEF6FF'}
                        borderRadius={4}
                        display="flex"
                        height={220}
                        justifyContent="center"
                        onClick={handleClickOpen}
                        p={1}
                        style={{ cursor: 'pointer' }}
                        width={'100%'}
                    >
                        <VideoLibraryIcon style={{ color: '#5C3F87' }} />
                        <Box mr={0.2} />
                        <Typography variant={'body2'}>{'Click to add video'}</Typography>
                    </Box>
                ) : (
                    // <Box
                    //     alignItems={'center'}
                    //     display={'flex'}
                    //     flexDirection={'column'}
                    //     justifyContent={'center'}
                    //     p={2}
                    // >
                    //     <video controls height="auto" src={selected} width="100%" />
                    //     <Button onClick={handleDelete} sx={{ marginTop: 2, color: theme.palette.secondary.main }}>
                    //         {'Remove'}
                    //     </Button>
                    // </Box>
                    <>
                        <Box alignItems={'center'} display={'flex'} justifyContent={'flex-end'} width={'100%'}>
                            <Chip
                                color={'secondary'}
                                label={'Remove'}
                                onDelete={() => {
                                    setSelected('');
                                }}
                            />
                        </Box>
                        <video controls height="auto" src={selected} width="100%" />
                    </>
                )}
            </Box>
            <input
                accept=".mov,.mp4"
                className="VideoInput_input"
                hidden
                onChange={handlePdfUpload}
                ref={inputRef}
                type="file"
            />
        </Box>
    );
};

FormFileUploadElement.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.string.isRequired,
    setSelected: PropTypes.func.isRequired,
};

export default FormFileUploadElement;
