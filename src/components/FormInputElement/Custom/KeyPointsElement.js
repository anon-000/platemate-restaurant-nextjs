import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { uploadFile } from '../../../apis/rest.app';
import {AddAPhoto, Delete} from "@mui/icons-material";
import {Avatar, Box, Button, IconButton, Stack, TextField, Typography} from "@mui/material";

const KeyPointsElement = ({ setValue, value }) => {
    const avatarRef = useRef();
    const [avatar, setAvatar] = useState(value);
    const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const uploadImage = async () => {
        const file = avatarRef.current.files[0];

        if (!file) return enqueueSnackbar('Please select a valid image', { variant: 'error' });
        setUploading(true);

        const coverResponse = await uploadFile(file);
        setUploading(false);
        if (!coverResponse) return;
        setAvatar(coverResponse.path)
        // onChange({ target: { value: coverResponse.link } });
    };

    return (
        <Box display="flex" flexDirection={'column'}>
            <Box display={'flex'} p={2}>
                <Box component="label" display="flex" sx={{ height: 100, width: 100 }} mr={2}>
                    <Avatar src={avatar} style={{ margin: 'auto', height: 100, width: 100, fontSize: 30, cursor: 'pointer' }} variant={'square'}>
                        <AddAPhoto fontSize="inherit" height={50} width={50} />
                    </Avatar>
                    <input
                        accept="image/*"
                        hidden
                        onChange={(event) => {
                            // eslint-disable-next-line no-undef
                            const fr = new FileReader();
                            // when image is loaded, set the src of the image where you want to display it
                            fr.onload = function () {
                                setAvatar(this.result);
                                uploadImage();
                            };
                            // fill fr with image data
                            if (event.target.files && event.target.files.length) fr.readAsDataURL(event.target.files[0]);
                        }}
                        ref={avatarRef}
                        type="file"
                    />
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} width={'100%'}>
                    <TextField
                        color={'primary'}
                        fullWidth
                        label={'Plan Name'}
                        size={'small'}
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                        variant="outlined"
                    />
                    <Button
                        disabled={!(title&&title.length>0 && avatar&&avatar.length>0) }
                        variant={'contained'}
                        color={'secondary'}
                        sx={{marginTop: 3}}
                        onClick={() => {
                            let _selected = value;
                            _selected.push({
                                title,
                                // description,
                                image: avatar
                            });
                            setValue([..._selected]);
                            setTitle('');
                            // setDescription('');
                            setAvatar('');
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'} mt={1} mb={1}>
                {
                    value.map((each, pos) => (
                        <Box display={'flex'} alignItems={'center'}>
                            <img src={each.image} style={{width: 50, height: 50}} alt={'kwy-point-icon'} />
                            <Box pl={1}>
                                <Typography>
                                    {each.title}
                                </Typography>
                                {/*<Typography variant={'caption'} sx={{marginTop: 1}}>*/}
                                {/*    {each.description}*/}
                                {/*</Typography>*/}
                            </Box>
                            <Box flexGrow={1} />
                            <IconButton
                                size={'small'}
                                onClick={() => {
                                    let _selected = value;
                                    _selected.splice(pos, 1);
                                    setValue([..._selected]);
                                }}
                            >
                                <Delete color={'secondary'}/>
                            </IconButton>
                        </Box>
                    ))
                }
            </Box>

        </Box>
    );
};

KeyPointsElement.propTypes = {
    setValue: PropTypes.func,
    value: PropTypes.string,
    each: PropTypes.object,
    pos: PropTypes.number,
};

KeyPointsElement.defaultProps = {
    setValue: () => {},
    value: '',
};

export default KeyPointsElement;
