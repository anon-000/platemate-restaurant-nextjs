import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";

const TransactionDetails = ({each,setEach,setOpen,setIndex}) =>{

    return(
        <Box display={'flex'} flexDirection={'column'}>
            <Box display={'fk=lex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                <Typography fontWeight={600}>
                    {`Transaction - ${each?.transactionId}`}
                </Typography>
                <img src={'images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={() =>{setEach('');setIndex('');setOpen(false);}}/>
            </Box>
            <Typography variant={'caption'} fontWeight={600}>
                {'Date & Time'}
            </Typography>
            <Typography variant={'body2'}>
                {moment(each.requestScheduledOn).format('Do MMM YYYY hh:mm A')}
            </Typography>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:1}}>
                {'Amount'}
            </Typography>
            <Box display={'flex'}>
                <Typography variant={'body2'}>
                    {'Bill Amount: '}
                </Typography>
                <Typography variant={'caption'} fontWeight={600} sx={{ml:1}}>
                    {'Rs '+ each.transaction?.amount}
                </Typography>
            </Box>
            <Box display={'flex'}>
                <Typography variant={'body2'}>
                    {`Convenience fee (${each?.transaction?.convenienceFee}) :`}
                </Typography>
                <Typography variant={'caption'} fontWeight={600} sx={{ml:1}}>
                    {'Rs '+each?.transaction?.totalAmount}
                </Typography>
            </Box>
            <Typography variant={'caption'} fontWeight={600} sx={{mt:2}}>
                {'User'}
            </Typography>
            <Accordion sx={{mt:2}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Box display={'flex'} alignItems={'center'}>
                        <Avatar src={each?.user?.avatar}>{each?.user?.name?.charAt(0)}</Avatar>
                        <Typography sx={{ml:1.5}}>{`${each?.user?.name}`}</Typography>
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
                    </Box>
                </AccordionDetails>
            </Accordion>

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
                {'Service Details'}
            </Typography>
            <Typography variant={'body2'}>
                {each?.serviceType?.description}
            </Typography>
            {/*{*/}
            {/*    each?.status === 1 ?<Button variant={'outlined'} color={'primary'} fullWidth sx={{mt:2}} onClick={cancelRequest} disabled={loading}>*/}
            {/*        {'CANCEL REQUEST'}*/}
            {/*    </Button>:''*/}
            {/*}*/}

        </Box>
    );
};

export default TransactionDetails;