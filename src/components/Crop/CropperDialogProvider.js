import React from 'react';
import CropperDialog from './CropperDialog';

const CropperDialogContext = React.createContext({});

export const CropperDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConfig, setDialogConfig] = React.useState({});

    const openDialog = ({ cancelLabel = 'Cancel', okLabel = 'Save', src, callBack, aspectRatio }) => {
        setDialogOpen(true);
        setDialogConfig({ cancelLabel, okLabel, src, callBack, aspectRatio });
    };

    const resetDialog = () => {
        setDialogOpen(false);
        setDialogConfig({});
    };

    const onCropped = (src) => {
        resetDialog();
        dialogConfig.callBack({
            status: 'CROPPED',
            src,
        });
    };

    const onSelected = (src) => {
        setDialogConfig({
            ...dialogConfig,
            src,
        });
    };

    const onDismiss = () => {
        resetDialog();
        if (dialogConfig.src) {
            dialogConfig.callBack({
                status: 'SELECTED',
                src: dialogConfig.src,
            });
        } else {
            dialogConfig.callBack({
                status: 'CANCELED',
            });
        }
    };

    return (
        <CropperDialogContext.Provider value={{ openDialog }}>
            <CropperDialog
                aspectRatio={dialogConfig.aspectRatio}
                cancel={onDismiss}
                dismiss={onDismiss}
                onCropped={onCropped}
                onSelected={onSelected}
                show={dialogOpen}
                src={dialogConfig.src}
            />
            {children}
        </CropperDialogContext.Provider>
    );
};

export const useCropperDialog = () => {
    const { openDialog } = React.useContext(CropperDialogContext);

    const getCroppedImage = ({ ...options }) =>
        new Promise((res) => {
            openDialog({ callBack: res, ...options });
        });
    return {
        getCroppedImage,
    };
};

export const withCropper = (Component) => (props) => {
    return (
        <CropperDialogProvider>
            <Component {...props} />
        </CropperDialogProvider>
    );
};
