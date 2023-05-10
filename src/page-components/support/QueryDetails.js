import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import {SupportService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import {useUser} from "../../store/UserContext";

const QueryDetails = ({each, index, setAlSupportRequest,openDialog}) =>{
    const Color=['#508CD2','#47D15E']
    const { enqueueSnackbar } = useSnackbar();
    const [user] = useUser();

    console.log('each',each.each);
    return(
        <Box display={'flex'} flexDirection={'column'}>
            <Box display={'fk=lex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                <Typography>
                    {'Support Query'}
                </Typography>
                <img src={'images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={openDialog}/>
            </Box>
            <Typography variant={'caption'} fontWeight={600}>
                {'Date'}
            </Typography>
            <Typography variant={'body2'}>
                {moment(each.createdAt).format('Do MMM YYYY')}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mb:1,mt:2}}>
                {'User'}
            </Typography>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Box display={'flex'} alignItems={'center'}>
                        <Avatar src={each?.user?.avatar}>{each?.user?.name?.charAt(0)}</Avatar>
                        <Typography sx={{ml:1.5}}>{each?.user?.name}</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant={'caption'} sx={{fontWeight:500}}>
                            Phone Number
                        </Typography>
                        <Typography variant={'caption'}>
                            {each?.user?.phone}
                        </Typography>
                        <Typography variant={'caption'} sx={{fontWeight:500,mt:1.5}}>
                            Email Id
                        </Typography>
                        <Typography variant={'caption'}>
                            {each?.user?.email}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Query'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.query}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'Status'}
            </Typography>
            <Typography variant={'body2'} sx={{color:Color[each?.status -1]}}>
                {each?.status ===1?'Pending':'Resolved'}
            </Typography>
            {
                each?.status ===1 && user?.role !== 4 &&
                    <>
                        <Button
                            variant={'outlined'}
                            color={'primary'}
                            fullWidth
                            sx={{mt:2}}
                            onClick={() =>{
                                SupportService.path(each?.id,{status:2})
                                    .then((res) =>{
                                        setAlSupportRequest(([...datum])=>{
                                            datum[index] =res;
                                            return datum;
                                        })
                                    }).catch((error) =>{
                                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                                });
                            }}>
                            {'MARK AS RESOLVED'}
                        </Button>
                    </>
            }

        </Box>
    );
};

export default QueryDetails;