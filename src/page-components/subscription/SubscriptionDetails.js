import React, {useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import {ServiceRequestService, SubscriptionService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const SubscriptionDetails = ({setOpen,each,setEach,setIndex,setData,index,openDialog}) =>{
    const Color = ['#F5993D','#40BF55','#9F66CC'];

    function toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        console.log('hours',hours);
        return `${padToTwoDigits(hours >12?hours-12:hours)}:${padToTwoDigits(minutes)} ${hours>12?'PM':'AM'}`;
    }
    const { enqueueSnackbar } = useSnackbar();


    const[loading,setLaoding] = useState(false);

    function padToTwoDigits(num) {
        return num.toString().padStart(2, '0');
    };

    const cancelSubscription = () =>{
        setLaoding(true);
        SubscriptionService.patch(each.id,{
            "status": 4
        },{query:{$eager:'[familyMembers.[relation],serviceType]',}})
            .then((res)=>{
            setData(([...datum])=>{
                let _data = datum;
                _data[index] = res;
                return _data;
            });
            enqueueSnackbar('Cancelled successfully', { variant: 'success' });
            openDialog();
        }).catch((error) =>{
            enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        }).finally(()=>{
            setLaoding(false);
        });
    };

    return(
        <Box display={'flex'} flexDirection={'column'}>
            <Box display={'fk=lex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                <Typography fontWeight={600}>
                    {'Subscription Request'}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={() =>{setOpen(false);setEach('');setIndex('');}}/>
            </Box>
            <Typography variant={'caption'} fontWeight={600}>
                {'Subscription type'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.subscriptionType === 1 ?'Daily':each?.subscriptionType === 2 ?'Weekly':'Monthly'}
                {each?.isLastOfMonth === 1 ?'(Last of every month)':each?.dateOfMonth !== null?`${' ('+each?.dateOfMonth +' of every month)' }`:''}
            </Typography><Typography variant={'caption'} fontWeight={600} sx={{mt:1}}>
                {'Time'}
            </Typography>
            <Typography variant={'body2'}>
                {toHoursAndMinutes(each?.time)}
            </Typography><Typography variant={'caption'} fontWeight={600} sx={{mt:1}}>
                {'End Date'}
            </Typography>
            <Typography variant={'body2'}>
                {moment(each.requestScheduledOn).format('Do MMM YYYY')}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mb:1,mt:2}}>
                {'Family Member'}
            </Typography>
            {
                each?.familyMembers?.map((e) =>(
                    <Accordion sx={{mt:2}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Box display={'flex'} alignItems={'center'}>
                                <Avatar src={e?.avatar}>{e?.name?.charAt(0)}</Avatar>
                                <Typography sx={{ml:1.5}}>{`${e?.name}(${e?.relation?.relationType})`}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display={'flex'} flexDirection={'column'}>
                                <Typography variant={'caption'} sx={{fontWeight:500}}>
                                    Phone Number
                                </Typography>
                                <Typography variant={'caption'}>
                                    {e?.phone}
                                </Typography>
                                <Typography variant={'caption'} sx={{fontWeight:500,mt:1.5}}>
                                    Address
                                </Typography>
                                <Typography variant={'caption'}>
                                    {e?.address?.addressLine1+','+e?.address?.city+','+e?.address?.state+','+e?.address?.pinCode}
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            }

            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Service Type'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.serviceType?.name}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Request Details'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.serviceType?.description}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Status'}
            </Typography>
            <Typography variant={'body2'} sx={{color:Color[each?.status -1]}}>
                {each?.status === 1 ?'Pending':each?.status === 2 ? 'OnGoing':'Ended'}
            </Typography>
            <Button variant={'outlined'} color={'secondary'} sx={{mt:2}} onClick={cancelSubscription}>
                {'CANCEL SUBSCRIPTION'}
            </Button>
            <Typography variant={'caption'} sx={{fontStyle:'italic',mt:1}}>
                {'*Subscription can be cancelled before 24 hrs of the service time'}
            </Typography>
        </Box>
    );
};

export default SubscriptionDetails;