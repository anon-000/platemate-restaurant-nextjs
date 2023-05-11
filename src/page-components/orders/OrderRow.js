import React, {useState} from "react";
import {Box, CircularProgress, Grid, MenuItem, Select, Switch, Typography} from "@mui/material";
import {styled} from "@mui/styles";
import {MenuCategoryService, MenuItemService, OrderService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import {useUser} from "../../store/UserContext";

const AntSwitch = styled(Switch)(({theme}) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme?.palette?.mode === 'dark' ? '#177ddc' : '#407FBF',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme?.transitions?.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme?.palette?.mode === 'dark' ? 'rgba(255,255,255,.35)' : '#D14747',
        boxSizing: 'border-box',
    },
}));


// export enum OrderStatus {
//     INITIATED = 0,
//     PLACED = 1,
//     IN_MAKING = 2,
//     COOKED = 3,
//     COMPLETED = 4,
//     CANCELLED = 6,
// }


const OrderRow = ({each, index, setAllServices, allServices, setIndex, setEach, setOpen}) => {
    const {enqueueSnackbar} = useSnackbar();

    const [statusLoading, setStatusLoading] = useState(false);

    const [user, setUser] = useUser();

    const [status, setStatus] = useState(each.status - 1);


    const statusList = ["PLACED", "IN MAKING", "COOKED", "COMPLETED", "CANCELLED"]


    const handleChange = (value) => {

        setStatus(value)
        setStatusLoading(true);
        OrderService.patch(each?._id, {
            "status": value + 1,
        })
            .then((res) => {

                setStatusLoading(false);
                setAllServices(([...member]) => {
                    member[index].status = value + 1;
                    return member;
                });
            }).catch((error) => {
            setStatusLoading(false);
            enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
        });
    };
    return (
        <>
            <Box mt={2} sx={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: '1px solid #B3B3B3',
                textAlign: 'center',
            }}>
                <Grid container>
                    <Grid item xs={2}>
                        <img height={120} width={130} alt={''} src={each?.orderedItems[0].menuItem.avatar}/>
                    </Grid>
                    <Grid item xs={6} display={'flex'} flexDirection={'column'} justifyContent={'left'}
                          alignItems={"start"}>
                        <Typography variant='body1'>{each.orderedItems.length == 1
                            ? each?.orderedItems[0].menuItem.name
                            : `${each.orderedItems[0].menuItem.name} & ${(each.orderedItems.length - 1)} more`}</Typography>
                        <Typography mt={1} variant='body2'
                                    sx={{wordBreak: 'break-all'}}>{`Order Id : ${each.bookingId}`}</Typography>
                        <Typography mt={1} variant='body1'
                                    sx={{wordBreak: 'break-all'}}>{`Rs. ${each.price.finalPrice}`}</Typography>
                        <Typography mt={1} variant='body1'
                                    sx={{wordBreak: 'break-all'}}>{`Table number : ${each.table.tableNumber}`}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Box display={'flex'} alignItems={'center'} ml={6} justifyContent={'center'}>
                            {

                                statusLoading ? <CircularProgress/> :
                                    each.status === 6 ? <Typography mt={1} variant='body2' color={'red'}
                                                                    sx={{wordBreak: 'break-all'}}>{`Cancelled`}</Typography> :
                                        <Select
                                            value={status}
                                            onChange={(e) => handleChange(e.target.value)}
                                            displayEmpty
                                            inputProps={{'aria-label': 'Without label'}}
                                        >
                                            {
                                                statusList?.map((e, i) => {
                                                    return <MenuItem value={i}>{e}</MenuItem>
                                                })
                                            }
                                        </Select>
                            }
                        </Box>
                    </Grid>
                    {/*{*/}
                    {/*    <Grid item xs={0.5}>*/}
                    {/*        <img*/}
                    {/*            src={'/images/icons/Edit-icon.svg'}*/}
                    {/*            alt={'Image'}*/}
                    {/*            style={{cursor: 'pointer'}}*/}
                    {/*            onClick={() => {*/}
                    {/*                setIndex(index);*/}
                    {/*                setEach(each);*/}
                    {/*                setOpen(true);*/}
                    {/*            }}/>*/}
                    {/*    </Grid>*/}
                    {/*}*/}
                </Grid>
            </Box>
        </>
    );
};

export default OrderRow;