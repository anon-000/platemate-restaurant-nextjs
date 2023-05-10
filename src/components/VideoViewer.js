import React from 'react';
import {Dialog} from "@mui/material";

export default function VideoViewer(props) {
    const { width, height, source, openDialog, setOpenDialog } = props;

    return (
        <Dialog
            fullWidth
            onClose={() => {
                setOpenDialog(false);
            }}
            open={openDialog}
            style={{ paddingTop: 0 }}
        >
            {/*<DialogContent>*/}
            {source ? (
                <video className="VideoInput_video" controls height={height} src={source} width="100%" />
            ) : (
                <div className="VideoInput_footer">{source || 'No video found'}</div>
            )}
        </Dialog>
    );
}
