import React from "react";
import { Box,Grid, Switch, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { styled } from "@mui/styles";
import moment from "moment";

const SubscriptionRow = ({each,index,setOpen,setEach,setIndex,setWhatToOpen}) => {
    console.log('each',each);
    const Color = ['#F5993D','#40BF55','#9F66CC']

    return (
        <>
            <Box mt={2} sx={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: '1px solid #B3B3B3',
                textAlign: 'center',
                cursor:'pointer'
            }} onClick={() =>{setIndex(index);setEach(each);setWhatToOpen('subscription-details');setOpen(true);}}>
                <Grid container sx={{display:'flex',alignItems:'center'}}>
                    <Grid item xs={2}>
                        <Typography variant='body2'>{each?.id}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='body2'>{each?.familyMembers?.map((e)=>e?.name+',')}</Typography>
                    </Grid><Grid item xs={2} >
                    <Typography variant='body2'>
                        {each?.serviceType?.name}
                    </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='body2'>{each?.subscriptionType === 1 ?'Daily':each?.subscriptionType === 2 ?'Weekly':'Monthly'}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{moment(each?.endDate).format('DD/MM/YYYY')}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{color:Color[each?.status -1]}}>
                            {each?.status === 1 ?'Pending':each?.status === 2 ? 'Completed':'Canceled'}
                        </Box>
                    </Grid>
                    {/*<Grid item xs={1.7}>*/}
                    {/*    <img*/}
                    {/*        src={'/images/icons/Edit-icon.svg'}*/}
                    {/*        alt={'Image'}*/}
                    {/*        style={{cursor:'pointer'}}*/}
                    {/*        onClick={() =>{setOpen(true);setEach(each);setIndex(index);}}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                </Grid>
            </Box>
        </>
    );
};

export default SubscriptionRow;