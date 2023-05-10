import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {StateService, uploadFile, UsersService} from '../../apis/rest.app';
import { FLD_TYPE_TEXT } from '../../constants/field-types';
import FormInputElement from '../../components/FormInputElement';
import { useSnackbar } from 'notistack';
import Confirm from '../../components/Confirm';
import useHandleError from '../../hooks/useHandleError';
import {
    Avatar,
    Box,
    Button, CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    TableCell,
    TableRow,
} from "@mui/material";
import {FiberManualRecord} from "@mui/icons-material";
import CropImage from "../../components/Crop/CropImage";
import moment from "moment";
import {useRouter} from "next/router";


const UnverifiedRow = ({ each, onEdit, onDelete, pos }) => {
    const types = ['', 'Owner/buyer', 'Builder', 'Broker']
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();
    const Router = useRouter();
    const [data, setData] = useState(each);
    const [creating, setCreating] = useState(false);
    const [errorObj, setErrorObj] = useState({});

    const [open, setOpen] = useState(false);

    const [image, setImage] = useState(data ? data.image : null);
    const [src, setSrc] = useState(null);

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleClose = () => {
        if (creating) return;
        setOpen(false);
    };

    /**
     *
     * @param {String} key - Key of elements on the from
     * @return {(function(*): void)|*}
     */
    const handleChange = (key) => (event) => {
        setData({
            ...data,
            [key]: event.target.value,
        });
    };

    const form = [
        {
            component: (
                <Box width={'100%'} key={'image-cropper-state'}>
                    <CropImage srcParent={src} setSrcParent={setSrc} image={image} setImage={setImage} />
                </Box>
            ),
        },
        {
            type: FLD_TYPE_TEXT,
            label: 'Enter name',
            placeholder: 'Enter the name',
            autocomplete: 'off',
            autofocus: true,
            size: 'small',
            margin: 'dense',
            key: 'name',
            required: true,
        },
    ];

    /**
     * @description To delete a brand
     */
    const deleteBrand = () => {
        Confirm('Are you sure ?', 'Do you really want to delete this state?', 'Delete', '').then(() => {
            StateService.remove(each._id)
                .then((response) => {
                    onDelete(response);
                    enqueueSnackbar('Deleted SuccessFully', {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };

    /**
     * @description To delete a brand
     */
    const verifyUser = () => {
        Confirm('Are you sure ?',
            'Do you really want to verify this user?',
            'Yes, Sure', '').then(() => {
            UsersService.patch(each._id, {
                status: 2,
            })
                .then((response) => {
                    onDelete(response);
                })
                .catch((error) => {
                    handleError()(error);
                })
                .finally(() => {
                    // setCreating(false);
                });
        });

    };

    /**
     *
     * @param {Number, Text} value
     * @param {Boolean} isNumber
     * @return {*|string}
     */
    const emptyValue = (value, isNumber = false) => {
        if (isNumber) {
            return value;
        } else {
            return value ? value : '---';
        }
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>{pos+1}</TableCell>
                <TableCell>{emptyValue(each.name, false)}</TableCell>
                <TableCell sx={{maxWidth: 220, wordBreak: 'break-all'}}>{emptyValue(each.email, false)}</TableCell>
                <TableCell>{emptyValue(each.phone, false)}</TableCell>
                <TableCell>{emptyValue(types[each.type], false)}</TableCell>
                <TableCell>
                    {each ? each?.status === 1 ? 'Un-Verified' :
                        each?.status === 2 ? 'Verified' :
                            each?.status === 3 ? 'Blocked' : '' : ''}
                </TableCell>
                <TableCell align={'right'} >
                    <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                        <Button
                            color={'secondary'}
                            onClick={() => {
                                Router.push(`/user/${each._id}`);
                            }}
                            variant={'outlined'}
                        >
                            {'View Profile'}
                        </Button>
                        {
                            (each.status === 1) &&
                            <Button
                                color={'primary'}
                                sx={{marginLeft: 2}}
                                onClick={verifyUser}
                                variant={'contained'}
                            >
                                {'Verify'}
                            </Button>
                        }
                    </Box>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

UnverifiedRow.propTypes = {
    each: PropTypes.object.isRequired,
    pos: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UnverifiedRow;
