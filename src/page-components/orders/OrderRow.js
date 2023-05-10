import React, {useState} from "react";
import {Box, Grid, Switch, Typography} from "@mui/material";
import {styled} from "@mui/styles";
import {MenuCategoryService, MenuItemService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import {useUser} from "../../store/UserContext";

const AntSwitch = styled(Switch)(({theme}) => ({
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

const OrderRow = ({each, index, setAllServices, allServices, setIndex, setEach, setOpen}) => {
    const {enqueueSnackbar} = useSnackbar();

    const [statusLoading, setStatusLoading] = useState(false);

    const [user, setUser] = useUser();

    const handleChange = () => {

        console.log(each?._id)
        setStatusLoading(true);
        MenuItemService.patch(each?._id, {
            "status": each?.status === 1 ? 2 : 1,
        })
            .then((res) => {
                setStatusLoading(false);
                setAllServices(([...member]) => {
                    member[index] = res;
                    return member;
                });
            }).catch((error) => {
            setStatusLoading(false);
            enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
        });
    };
    return (
        <>
            <Box mt={2} sx={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: '1px solid #B3B3B3',
                textAlign: 'center',
            }}>
                <Grid container>
                    <Grid item xs={0.5}>
                        <Typography variant='body2'>{index + 1}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body2'>{each?.name}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant='body2' sx={{wordBreak: 'break-all'}}>{each?.description}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display={'flex'} alignItems={'center'} ml={6} justifyContent={'center'}>
                            <Typography sx={each?.status === 1 ? {color: 'primary.main'} : {color: '#D14747'}}>
                                {each?.status === 1 ? 'Active' : 'DeActive'}
                            </Typography>
                            {
                                <AntSwitch
                                    disabled={statusLoading}
                                    checked={each?.status === 1}
                                    inputProps={{
                                        'aria-label': 'ant design'
                                    }}
                                    sx={{ml: 1}}
                                    onChange={() => {
                                        handleChange();
                                    }}
                                />
                            }

                        </Box>
                    </Grid>
                    {
                        <Grid item xs={0.5}>
                            <img
                                src={'/images/icons/Edit-icon.svg'}
                                alt={'Image'}
                                style={{cursor: 'pointer'}}
                                onClick={() => {
                                    setIndex(index);
                                    setEach(each);
                                    setOpen(true);
                                }}/>
                        </Grid>
                    }
                </Grid>
            </Box>
        </>
    );
};

export default OrderRow;