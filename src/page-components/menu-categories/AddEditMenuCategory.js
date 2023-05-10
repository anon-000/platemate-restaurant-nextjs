import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import {MenuCategoryService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const AddEditMenuCategory = ({each, index, setOpen, setData, data, openDialog}) => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [feePercentage, setFeePercentage] = useState('');

    useEffect(() => {
        if (each) {
            setType(each?.name);
            setDescription(each?.description);
            setFeePercentage(each?.feePercentage);
        }
    }, [each]);

    const handleSubmit = async () => {
        if (each) {
            setLoading(true);
            await MenuCategoryService.patch(each?.id, {
                "name": type,
                "description": description,
                "avatar": "",
            })
                .then(async (res) => {
                    setData(([...datum]) => {
                        datum[index] = res;
                        return datum;
                    });
                    setOpen(false);
                    setLoading(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        } else {
            setLoading(true);
            await MenuCategoryService.create({
                "name": type,
                "description": description,
                "avatar": "",
            })
                .then(async (res) => {
                    setLoading(false);
                    setData([res, ...data]);
                    enqueueSnackbar('Menu category added successfully', {variant: 'success'});
                    setOpen(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                <Typography sx={{fontWeight: 600}}>
                    {each ? 'Edit service type' : 'Add new service type'}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor: 'pointer'}}
                     onClick={openDialog}/>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                <Typography>
                    {'Title'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setType(event.target.value)}
                    value={type}
                    variant="outlined"
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Description'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                    variant="outlined"
                    multiline
                    rows={4}
                />
            </Box>
            {/*<Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>*/}
            {/*    <Typography sx={{mb: 0.5}}>*/}
            {/*        {'Fee Percentage'}*/}
            {/*    </Typography>*/}
            {/*    <TextField*/}
            {/*        size={'small'}*/}
            {/*        color={'primary'}*/}
            {/*        fullWidth*/}
            {/*        onChange={(event) => {*/}
            {/*            setFeePercentage(event.target.value);*/}
            {/*        }}*/}
            {/*        value={feePercentage}*/}
            {/*        variant="outlined"*/}
            {/*    />*/}
            {/*</Box>*/}
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                <Button
                    fullWidth
                    color="primary"
                    disabled={loading || type === '' || description === ''}
                    variant={'contained'}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24}/> : each ? 'SAVE CHANGES' : 'ADD'}
                </Button>
            </Box>
        </>
    );
};

export default AddEditMenuCategory;