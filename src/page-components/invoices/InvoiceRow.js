import React from "react";
import { Box,Grid, Switch, Typography } from "@mui/material";
import moment from "moment";

const InvoiceRow = ({each,index,setOpen,setEach,setIndex}) => {
    let Color = ['#F5993D','#40BF55'];
    return (
        <>
            <Box mt={2} sx={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: '1px solid #B3B3B3',
                textAlign: 'center',
                cursor:'pointer'
            }} onClick={() =>{setOpen(true);setEach(each);setIndex(index);}}>
                <Grid container>
                    <Grid item xs={2.4}>
                        <Typography variant='body2'>{each?.invoiceId}</Typography>
                    </Grid>
                    <Grid item xs={2.4} >
                        <Typography variant='body2'>
                            {moment(each.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                    </Grid><Grid item xs={2.4} >
                        <Typography variant='body2'>
                            {moment.months()[each?.month-1]}
                        </Typography>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{'$ '+each?.amountINR}</Typography>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{color:Color[each?.status-1],fontWeight:600,fontSize:14}}>
                            {each?.status ===1?'Pending':'Paid'}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default InvoiceRow;