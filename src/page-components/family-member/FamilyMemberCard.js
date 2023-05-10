import React, {useState} from "react";
import {Avatar, Box, Button, Divider, Switch, Typography} from "@mui/material";
import {styled} from "@mui/styles";
import {FamilyMemberService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import AllForOneDialog from "../AllForOneDialog";

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme?.palette?.mode === 'dark' ? '#177ddc' : '#407FBF',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme?.transitions?.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme?.palette?.mode === 'dark' ? 'rgba(255,255,255,.35)' : '#D14747',
        boxSizing: 'border-box',
    },
}));

const FamilyMemberCard = ({open,setOpen,each,index,setAllFamilyMembers,allFamilyMembers,setEach,setIndex}) =>{

    const [statusLoading, setStatusLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = () => {
        setStatusLoading(true);
        FamilyMemberService.patch(each?.id, {
            "status": each?.status === 1 ? 2 : 1,
        })
            .then((res) => {
                setStatusLoading(false);
                setAllFamilyMembers(([...member]) => {
                    member[index] = res;
                    return member;
                });
            }).catch((error) => {
            setStatusLoading(false);
            enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        });
    };

    return(
        <>
            <Box display={'flex'} border={'1px solid #E6E6E6'} borderRadius={2} p={'30px 20px 30px 20px'} width={'100%'} mt={2}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} width={'30%'}>
                    <Avatar variant={'square'} src={each?.avatar} sx={{borderRadius:1,width:60,height:60}}>
                        {each?.name?.charAt(0)}
                    </Avatar>
                    <Typography sx={{mt:1}}>
                        {each?.name}
                    </Typography>
                    <Typography variant={'caption'} sx={{mt:0.5}}>
                        {each?.relation?.relationType}
                    </Typography>
                </Box>
                <Box ml={2}>
                    <Divider orientation={'vertical'}/>
                </Box>
                <Box ml={2} display={'flex'} justifyContent={'center'} flexDirection={'column'} width={'100%'}>
                    <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
                        <Box>
                            <Typography variant={'caption'}>
                                {'Phone Number'}
                            </Typography>
                            <Typography>
                                {each?.phone}
                            </Typography>
                        </Box>
                        <Box display={'flex'}>
                            <Box display={'flex'} alignItems={'center'} mr={3}>
                                <Typography sx={each?.status === 1 ?{color:'primary.main'}:{color:'#D14747'}}>
                                    {each?.status === 1 ?'Active':'DeActive'}
                                </Typography>
                                <AntSwitch
                                    disabled={statusLoading}
                                    checked={each?.status === 1}
                                    inputProps={{
                                        'aria-label': 'ant design'
                                    }}
                                    sx={{ ml: 1 }}
                                    onChange={() => {
                                        handleChange();
                                    }}
                                />
                            </Box>
                            <Button
                                startIcon={
                                    <img
                                        src={'/images/icons/Edit-icon.svg'}
                                        alt={'Image'}
                                    />
                                }
                                onClick={() => {
                                    setOpen(true);
                                    setEach(each);
                                    setIndex(index);
                                }}>
                                {'Edit Details'}
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant={'caption'}>
                        {'Address'}
                    </Typography>
                    <Typography>
                        {each?.address?.city+','+each?.address?.state+','+each?.address?.pinCode+','+each?.address?.addressLine1}
                    </Typography>
                </Box>
            </Box>
            {/*<AllForOneDialog*/}
            {/*    open={open}*/}
            {/*    setOpen={setOpen}*/}
            {/*    componentName={'family-member'}*/}
            {/*    data={allFamilyMembers}*/}
            {/*    setData={setAllFamilyMembers}*/}
            {/*    each={each}*/}
            {/*    index={index}*/}
            {/*/>*/}
        </>
    );
};

export default FamilyMemberCard;