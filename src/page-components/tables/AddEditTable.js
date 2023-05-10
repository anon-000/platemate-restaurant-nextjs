import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import {MenuCategoryService, TableService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const AddEditTable = ({each, index, setOpen, setData, data, openDialog}) => {
    const [tableNumber, setTableNumber] = useState('');
    const [seatCount, setSeatCount] = useState('');
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [feePercentage, setFeePercentage] = useState('');

    useEffect(() => {
        if (each) {
            setTableNumber(each?.tableNumber);
            setSeatCount(each?.seatsCount);
        }
    }, [each]);

    const handleSubmit = async () => {
        if (each) {
            setLoading(true);
            await TableService.patch(each?.id, {
                "tableNumber": parseInt(tableNumber),
                "seatsCount": parseInt(seatCount)
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
            await TableService.create({
                "tableNumber": parseInt(tableNumber),
                "seatsCount": parseInt(seatCount)
            })
                .then(async (res) => {
                    setLoading(false);
                    setData([res, ...data]);
                    enqueueSnackbar('Table added successfully', {variant: 'success'});
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
                    {each ? 'Edit Table' : 'Add Table'}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor: 'pointer'}}
                     onClick={()=> setOpen(false)}/>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                <Typography>
                    {'Table number'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setTableNumber(event.target.value)}
                    value={tableNumber}
                    variant="outlined"
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Seats count'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setSeatCount(event.target.value)}
                    value={seatCount}
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
                    disabled={loading || tableNumber === '' || seatCount === ''}
                    variant={'contained'}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24}/> : each ? 'SAVE CHANGES' : 'ADD'}
                </Button>
            </Box>
        </>
    );
};

export default AddEditTable;