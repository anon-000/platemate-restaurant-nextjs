import React, {useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import {ServiceRequestService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const RequestDetails = ({setOpen,setData,data,each,index,setEach,setIndex}) =>{
    console.log(each);
    const Color = ['#F5993D','#508CD2','#40BF55','#9F66CC']

    const { enqueueSnackbar } = useSnackbar();
    const [loading,setLoading] = useState(false);
    const cancelRequest = () =>{
        setLoading(true);
        ServiceRequestService.patch(each?.id,{status:4},{query:{$eager:'[familyMembers.[relation],serviceType, careManager]'}})
            .then((res) =>{
                setData(([...datum]) =>{
                    datum[index] = res;
                    return datum;
                });
                setLoading(false);
                setOpen(false);
                enqueueSnackbar('Request cancelled successfully', { variant: 'success' });
            })
            .catch((error) =>{
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                setLoading(false);
            });
    };

    return(
        <Box display={'flex'} flexDirection={'column'}>
            <Box display={'fk=lex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                <Typography fontWeight={600}>
                    {'Service Request'}
                </Typography>
                <img src={'images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={() =>{setOpen(false);setEach('');setIndex('');}}/>
            </Box>
            <Typography variant={'caption'} fontWeight={600}>
                {'Date & Time'}
            </Typography>
            <Typography variant={'body2'}>
                {moment(each.requestScheduledOn).format('Do MMM YYYY hh:mm A')}
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
                {'Request Type'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.serviceType?.name}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Query'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.serviceType?.description}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Status'}
            </Typography>
            <Typography variant={'body2'} sx={{color:Color[each?.status -1],fontWeight:600,fontSize:14}}>
                {each?.status === 1 ?'Pending':each?.status === 2 ? 'Accepted':each?.status === 3 ? 'Completed':'Canceled'}
            </Typography>
            {
                each?.status === 1 ?<Button variant={'outlined'} color={'primary'} fullWidth sx={{mt:2}} onClick={cancelRequest} disabled={loading}>
                    {'CANCEL REQUEST'}
                </Button>:''
            }

        </Box>
    );
};

export default RequestDetails;