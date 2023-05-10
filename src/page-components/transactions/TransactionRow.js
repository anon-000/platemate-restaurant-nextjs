import React from "react";
import { Box,Grid, Switch, Typography } from "@mui/material";
import moment from "moment";

const TransactionRow = ({each,index,setOpen,setEach,setIndex}) => {
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
                        <Typography variant='body2'>{each?.serviceLogId}</Typography>
                    </Grid>
                    <Grid item xs={2.4} >
                        <Typography variant='body2'>
                            {moment(each.createdAt).format('DD/MMM/YYYY')}
                        </Typography>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{each?.serviceType?.name}</Typography>
                    </Grid>
                    <Grid item xs={2.4} >
                        <Typography variant='body2'>{each?.serviceType?.description}</Typography>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            {
                                each.expenses?.length === 1?
                                    each.expenses.reduce((a,b)=>a.amount+b.amount).amount
                                    :each.expenses.reduce((a,b)=>a.amount+b.amount)
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default TransactionRow;