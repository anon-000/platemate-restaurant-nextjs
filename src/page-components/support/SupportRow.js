import React from "react";
import { Box,Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import moment from "moment";

const SupportRow = ({setOpen,each,index,setEach,setIndex}) => {
    const Color=['#508CD2','#47D15E']
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
                    <Grid item xs={4}>
                        <Typography variant='body2'>
                            {moment(each.createdAt).format('Do MMM YYYY')}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{wordBreak:'break-all'}}>
                        <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{each?.query}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{color:Color[each?.status -1]}}>
                        <Typography variant='body2'>{each?.status === 1 ?'Pending':'Resolved'}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SupportRow;