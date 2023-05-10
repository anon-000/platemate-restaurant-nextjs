import React, {useState} from 'react';
import {Box} from "@mui/material";
import {Add, Clear} from "@mui/icons-material";
import CropperDialog from "./CropperDialog";

export default function CropImageMulti({
  image, srcParent, setImage, setSrcParent, aspectRatio
}) {

    const [show, setShow] = useState(false);
    const [src, setSrc] = useState('');

    return (
        <Box display={'flex'} mb={1} flexWrap={'wrap'}>
            <Box display={'flex'} justifyContent={'center'}>
                <Box sx={{
                    height: 100,
                    width: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: `2px dashed grey`,
                }} onClick={()=>setShow(true)} p={1} mr={1} mb={1}>
                    <Add />
                </Box>
            </Box>
            {image && image.map((each) => (
                <Box width={100} display={'flex'} mr={1} mb={1}>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                        <img alt={'Profile Image'} height={'auto'} src={each} width={100} style={{borderRadius: 3}}/>
                    </Box>
                    <Clear onClick={() => {
                        setImage([...image.filter(e => e !== each)]);
                    }} style={{cursor: 'pointer', marginLeft: -25}}/>
                </Box>
            ))}
            {srcParent && srcParent.map((each) => (
                <Box width={100} display={'flex'} mr={1} mb={1}>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                        <img alt={'Profile Image'} height={'auto'} src={each} width={100} style={{borderRadius: 3}}/>
                    </Box>
                    <Clear onClick={() => {
                        setSrcParent([...srcParent.filter(e => e !== each)]);
                    }} style={{cursor: 'pointer', marginLeft: -25}}/>
                </Box>
            ))}

            <CropperDialog
                aspectRatio={aspectRatio ? aspectRatio : (9 / 9)}
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
                    let _srcParent = srcParent;
                    _srcParent.push(data);
                    setSrcParent([..._srcParent]);
                    setSrc(null);
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

