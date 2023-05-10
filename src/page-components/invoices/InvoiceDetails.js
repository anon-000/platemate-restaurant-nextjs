import React, {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import moment from "moment";
import {TransactionsService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import StripeComponent from "../../components/Stripe/stripe";

const InvoiceDetails = ({setData,setOpen,each,index,open,data,setEach,setIndex}) =>{
    let Color = ['#F5993D','#40BF55'];
    const { enqueueSnackbar } = useSnackbar();
    const [changeComponent,setChangeComponent] = useState(1);
    const [value,setValue] = useState('');

    return(
        <>
            {
                changeComponent === 1 ?
                    <>
                        <Box display={'flex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                            <Typography fontWeight={600}>
                                {`Transaction - ${each?.id}`}
                            </Typography>
                            <img src={'images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={()=>{setOpen(false);setEach('');setIndex('');}}/>
                        </Box>
                        <Box display={'flex'}  width={'100%'} justifyContent={'space-between'} >
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box fontWeight={600}>
                                    {'Date Generated'}
                                </Box>
                                <Box fontWeight={600}>
                                    {moment(each.createdAt).format('Do MMM YYYY')}
                                </Box>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box fontWeight={600}>
                                    <Typography>
                                        {'Status'}
                                    </Typography>
                                </Box>
                                <Box sx={{color:Color[each?.status-1]}}>
                                    <Typography>
                                        {each?.status ===1?'Pending':'Paid'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} mt={1}>
                            <Typography fontWeight={600}>
                                {'For Month'}
                            </Typography>
                            <Typography variant='body2'>
                                {moment.months()[each?.month-1]}
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} mt={1}>
                            <Typography fontWeight={600}>
                                {'Amount Payable'}
                            </Typography>
                            <Typography variant='body2'>
                                <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{each?.amountINR}</Typography>
                            </Typography>
                        </Box>
                        {
                            each?.status === 1 &&
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                fullWidth
                                sx={{mt:1}}
                                onClick={() =>{
                                    TransactionsService.create({
                                        "invoiceId": each?.id,
                                        "type": 2
                                    }).then((res) =>{
                                        setChangeComponent(2);
                                        setValue(res);
                                    }).catch((error) =>{
                                        enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                                    });
                                }}
                            >
                                {'MAKE PAYMENT'}
                            </Button>
                        }

                    </>: <StripeComponent res={value}/>
            }
        </>
    );
};

export default InvoiceDetails;