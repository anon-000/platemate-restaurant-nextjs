import React from "react";
import { Box,Grid, Typography } from "@mui/material";
import moment from "moment";

const RequestsRow = ({each,index,setEach,setIndex,setOpenDetailsDialog}) => {

    const Color = ['#F5993D','#508CD2','#40BF55','#9F66CC']

    return (
        <>
            <Box mt={2} sx={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: '1px solid #B3B3B3',
                textAlign: 'center',
                cursor:'pointer'
            }} onClick={() =>{setOpenDetailsDialog(true);setIndex(index);setEach(each);}}>
                <Grid container sx={{display:'flex',alignItems:'center'}}>
                    <Grid item xs={2}>
                        <Typography variant='body2'>{each?.requestId}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Typography variant='body2'>
                            {moment(each.requestScheduledOn).format('DD/MM/YYYY')}
                        </Typography>
                    </Grid><Grid item xs={2} >
                        <Typography variant='body2'>{each?.familyMembers?.map((e)=>e?.name+',')}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{each?.serviceType?.name}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Typography variant='body2'>{each?.serviceType?.description}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{color:Color[each?.status -1],fontWeight:600,fontSize:14}}>
                            {each?.status === 1 ?'Pending':each?.status === 2 ? 'Accepted':each?.status === 3 ? 'Completed':'Canceled'}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default RequestsRow;