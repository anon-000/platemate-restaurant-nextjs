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
                    setSelected([_video,...selected]);
                })
                .catch((error) => {
                    handleError()(error);
                });
        }
    };
    console.log('selected', selected);
    return (
        <Box spacing={1}>
            {/*<Typography variant={'body2'}>{label}</Typography>*/}
            <Box display={'flex'} flexWrap={'wrap'} width={'100%'}>
                {/*{selected === '' || selected === undefined ? (*/}
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
                    <Box display={'flex'} width={'100%'} mt={1}>
                        {
                            selected?.map((each,pos) => <Box display={'flex'} flexDirection={'column'}>
                                {/*<Box alignItems={'center'} display={'flex'} justifyContent={'flex-end'} width={'25%'}>*/}
                                {/*    <Chip*/}
                                {/*        color={'secondary'}*/}
                                {/*        label={''}*/}
                                {/*        onDelete={() => {*/}
                                {/*            let _selected = selected;*/}
                                {/*            _selected.splice(pos,1);*/}
                                {/*            setSelected([..._selected]);*/}
                                {/*        }}*/}
                                {/*    />*/}
                                {/*</Box>*/}
                                <video controls height="auto" src={each} width="25%" />
                                <Typography onClick={()=> {
                                    let _selected = selected;
                                    _selected.splice(pos,1);
                                    setSelected([..._selected]);
                                }} sx={{cursor:'pointer', color: 'red'}}>{'Remove'}</Typography>
                            </Box>)
                        }
                    </Box>
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
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
};

export default FormFileUploadElement;
