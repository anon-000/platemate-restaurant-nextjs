import React, {useEffect, useState} from 'react';
import {Box, Chip, Typography} from "@mui/material";
import {AddAPhoto} from "@mui/icons-material";
import CropperDialog from "./CropperDialog";

export default function CropImage({
  image, srcParent, setImage, setSrcParent,aspectRatio
}) {

    const [show, setShow] = useState(false);
    const [src, setSrc] = useState('');
    useEffect(() => {
        setSrc(srcParent);
    }, [srcParent]);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mb={1}>
            {image || srcParent ? (
                <Box width={200} display={'flex'}>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                        <img alt={'Profile Image'} height={'auto'} src={srcParent ? srcParent : image} width={200} style={{borderRadius: 5}}/>
                    </Box>
                    <Chip
                        clickable
                        style={{marginLeft: -70,marginTop: 5}}
                        color="secondary"
                        label="Clear"
                        onClick={() => {
                            setImage('');
                            setSrcParent('');
                        }}
                        onDelete={() => {
                        }}
                        size="small"
                    />
                </Box>
            ) : (
                <Box display={'flex'} justifyContent={'center'}>
                    <Box sx={{
                        height: 200,
                        width: 220,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: `2px dashed grey`,
                    }} onClick={()=>setShow(true)} p={1}>
                        <AddAPhoto />
                        <Box display={'flex'} justifyContent={'center'} mt={1} p={2}>
                            <Typography component={Box} textAlign={'center'} variant={'subtitle2'}>
                                {'Select an image'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
            <CropperDialog
                // aspectRatio={aspectRatio ? aspectRatio : (1/1)}
                cancel={() => {
                    if (src) setSrc(null);
                    else setShow(false);
                }}
                cancelLabel={src ? 'Clear Image' : 'Cancel'}
                dismiss={() => {
                    setShow(false);
                }}
                okLabel={'Save'}
                onCropped={(data) => {
                    setShow(false);
                    setSrcParent(data);
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
            />
        </Box>
    );
}

