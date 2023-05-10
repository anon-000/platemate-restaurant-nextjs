import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { uploadFile } from '../../apis/rest.app';
import {AddAPhoto} from "@mui/icons-material";
import {Avatar, Box} from "@mui/material";

const FormAvatarElement = ({ onChange, value }) => {
    const avatarRef = useRef();
    const [avatar, setAvatar] = useState(value);
    const { enqueueSnackbar } = useSnackbar();

    const uploadImage = async () => {
        // if (isAvatarChange) {
        const file = avatarRef.current.files[0];
        if (!file) return enqueueSnackbar('Please select a valid image', { variant: 'error' });

        const coverResponse = await uploadFile(file);

        if (!coverResponse) return;

        onChange({ target: { value: coverResponse.link } });
        // }
    };

    return (
        <Box component="label" display="flex">
            {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
            <Avatar src={avatar} style={{ margin: 'auto', height: 180, width: 180, fontSize: 100, cursor: 'pointer' }}>
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
    );
};

FormAvatarElement.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
};

FormAvatarElement.defaultProps = {
    onChange: () => {},
    value: '',
};

export default FormAvatarElement;
