import React, { useState } from 'react';
import Cropper from 'react-cropper';
import DragAndDrop from './DragAndDrop';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";

function CropperDialog({
   okLabel = 'Edit',
   cancelLabel = 'Cancel',
   show,
   dismiss,
   cancel,
   onCropped,
   onSelected,
   src,
   isSquare,
   aspectRatio,
}) {
    const [cropper, setCropper] = useState();

    const cropImage = () => {
        if (typeof cropper.getCroppedCanvas() === 'undefined' || !cropper.getCroppedCanvas()) {
            return;
        }
        onCropped(cropper.getCroppedCanvas().toDataURL());
    };

    const handleDrop = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            onSelected(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    return (
        <Dialog fullWidth maxWidth="xs" onClose={dismiss} open={show}>
            <DialogTitle>
                <Box display={'flex'} >
                    <Typography variant="h6">
                        {'Select Image'}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <div style={{ width: '100%' }}>
                    {!src ? (
                        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
                            <DragAndDrop handleDrop={handleDrop}>
                                <div style={{ height: 250, width: 380, borderRadius: 5}} />
                            </DragAndDrop>
                        </Box>
                    ) : (
                        <Cropper
                            style={{ height: 'auto', width: '100%' }}
                            // aspectRatio={isSquare ? 1 : aspectRatio ? aspectRatio : 12 / 16}
                            preview=".img-preview"
                            guides={true}
                            src={src}
                            ref={(c) => {
                                setCropper(c);
                            }}
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancel}>
                    {cancelLabel}
                </Button>
                {src ? (
                    <Button color="primary" variant="contained" onClick={() => cropImage()}>
                        {okLabel}
                    </Button>
                ) : (
                    <Button color="primary" variant="contained" disabled>
                        {okLabel}
                    </Button>
                )}
            </DialogActions>
        </Dialog>

    );
}

export default CropperDialog;
