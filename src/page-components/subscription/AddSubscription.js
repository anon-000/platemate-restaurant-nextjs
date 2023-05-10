import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Checkbox, Chip, Dialog, DialogContent, DialogTitle,
    FormControl, Grid,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select, Slide,
    TextField,
    Typography
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {FamilyMemberService, RequestTypeService, SubscriptionService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";
import moment from "moment";
import ClearIcon from '@mui/icons-material/Clear';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const AddSubscription = ({each,index,setOpen,setData,data,openDialog}) =>{
    const [selectedType, setSelectedType] = React.useState('All');
    const [familyMembers, setFamilyMembers] = React.useState([]);
    const [requestType, setRequestType] = React.useState([]);
    const [selectedFamilyMembers, setSelectedFamilyMembers] = React.useState([]);
    const [from,setFrom] = useState(null);
    const [fromError,setFromError] = useState(null);
    const [value, setValue] = React.useState(null);
    const [valueError, setValueError] = React.useState(null);
    const [loading,setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [details,setDetails] = useState('');
    const [subscriptionType,setSubscriptionType] = useState('All');
    const [selectDateOfAMonth,setSelectDateOfAMonth] = useState('All');
    const [openDateDialog,setOpenDateDialog] = useState(false);
    const [selectedDate,setSelectedDate] = useState(null);
    const [selectedDay,setSelectedDay] = useState('All');

    const handleChangeTime = (newValue) => {
        if (new Date(newValue).toString() === 'Invalid Date'){
            setValueError('Please provide a valid time');
        }else {
            setValue(newValue);
            setValueError(null);
        }
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedFamilyMembers([...familyMembers.filter((e) => value.some((id2 ) => id2 === e?.id))]);
    };

    const handleSubmit = async () => {
        let queries={
            "serviceTypeId": selectedType,
            "description": details,
            "familyMemberIds":selectedFamilyMembers?.map((e) =>e?.id),
            "subscriptionType": subscriptionType,
            "endDate": moment(new Date(from)).format('MM/DD/YYYY'),
        }
        if (subscriptionType === 1) {
            queries ={
                ...queries,
                time:new Date(value).getHours()*60+new Date(value).getMinutes()
            }
        }else if (subscriptionType === 2){
            queries ={
                ...queries,
                time:new Date(value).getHours()*60+new Date(value).getMinutes(),
                "dayOfWeek": selectedDay,
            }
        }else {
            if (selectDateOfAMonth === 'Last Date'){
                queries={
                    ...queries,
                    'isLastOfMonth':true,
                    time:new Date(value).getHours()*60+new Date(value).getMinutes(),
                }
            }else {
                queries={
                    ...queries,
                    'dateOfMonth':selectedDate,
                    time:new Date(value).getHours()*60+new Date(value).getMinutes(),
                }
            }
        }
        SubscriptionService.create(queries,{query:{$eager:'[familyMembers.[relation],serviceType]',}})
            .then((res)=> {
                setData([res,...data]);
                openDialog();
            }).catch((error)=>{
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        })
    };

    useEffect(() =>{
        FamilyMemberService.find({
            query: {
                $sort: {
                    createdAt: -1,
                },
                $limit: -1,
                $eager:'[relation]'
            },
        })
            .then((response) => {
                setFamilyMembers([...response]);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
            });
    },[]);

    useEffect(() =>{
        RequestTypeService.find({
            query: {
                $sort: {
                    createdAt: -1,
                },
                $limit: -1,
                $select:'[name,description]'
            },
        })
            .then((response) => {
                setRequestType([...response]);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
            });
    },[]);

    const Array = [{name:'Daily',value:1},{name:'Weekly',value:2},{name:'Monthly',value:3}]
    const SelectDate = ['Last Date','Select a date']
    const NumberArray =()=> {
        let a = [];
        for (let i = 1; i < 29; i++) {
            a.push(i);
        }
        return a;
    };

    return(
        <>
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Typography style={{fontSize:16,fontWeight:600}} >
                    {'Request a Subscription'}
                </Typography>
                <img
                    src={'/images/icons/cross_icon.svg'}
                    alt={'Cross-icon'}
                    style={{cursor:'pointer'}}
                    onClick={openDialog}
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                <Typography>
                    {'Subscription Type'}
                </Typography>
                <FormControl sx={{mt:1}}>
                    <Select
                        size={'small'}
                        value={subscriptionType}
                        onChange={(e) =>{setSubscriptionType(e.target.value);}}
                    >
                        <MenuItem value={'All'}>
                            {'Select a subscription Type'}
                        </MenuItem>
                        {Array.map((each) => (
                            <MenuItem key={each} value={each?.value}>
                                {each?.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            { subscriptionType === 2 &&
                <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                    <Typography>
                        {'Day'}
                    </Typography>
                    <FormControl sx={{mt:1}}>
                        <Select
                            size={'small'}
                            value={selectedDay}
                            onChange={(e) =>{setSelectedDay(e.target.value);}}
                        >
                            <MenuItem value={'All'}>
                                {'Click to select a day'}
                            </MenuItem>
                            {moment.weekdays().map((each,i) => (
                                <MenuItem key={each} value={i}>
                                    {each}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            }
            { subscriptionType === 3 &&
                <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                    <Typography>
                        {'Date of each month'}
                    </Typography>
                    {
                        selectDateOfAMonth === 'Select a date'?
                            <Box width={'100%'} display={'flex'} bgcolor={'#EBF4FF'} p={1} borderRadius={2}>
                                <Typography sx={{fontWeight:600,fontSize:16}}>
                                    {`${selectedDate}th of every month`}
                                </Typography>
                                <Box flexGrow={1}/>
                                <ClearIcon sx={{cursor:'pointer'}} onClick={()=>{setSelectDateOfAMonth('All');setSelectedDate(null);}}/>
                            </Box>:
                            <FormControl sx={{mt:1}}>
                                <Select
                                    size={'small'}
                                    value={selectDateOfAMonth}
                                    onChange={(e) =>{
                                        if (e.target.value === 'Select a date') {
                                            setOpenDateDialog(true);
                                        }else {
                                            setSelectDateOfAMonth(e.target.value);
                                        }
                                    }}
                                >
                                    <MenuItem value={'All'}>
                                        {'Click to select a date'}
                                    </MenuItem>
                                    {SelectDate.map((each) => (
                                        <MenuItem key={each} value={each}>
                                            {each}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                    }

                </Box>
            }
            {
                subscriptionType !=='All' &&
                <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                    <Typography>
                        {'Time'}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            onError={(t,r) =>{
                                if (t !== null || t=== 'invalidDate'){
                                    setValueError('Please provide a valid time');
                                }
                            }}
                            value={value}
                            onChange={handleChangeTime}
                            renderInput={(params) => <TextField {...params} size={'small'} autoComplete={'off'}/>}
                        />
                    </LocalizationProvider>
                    {
                        valueError !== '' ?
                            <Typography variant={'caption'} sx={{color:'red'}}>
                                {valueError}
                            </Typography>:''
                    }
                </Box>
            }
            <Box display={'flex'}>
                <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                    <Typography>
                        {'End Date'}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            onError={(t,r) =>{
                                if (t !== null || t=== 'invalidDate'){
                                    setFromError('Please provide a valid date');
                                }
                            }}
                            placeholder="Basic example"
                            value={from}
                            onChange={(newValue) => {
                                if (new Date(newValue).toString() === 'Invalid Date'){
                                    setFromError('Please provide a valid date');
                                }else {
                                    setFrom(newValue);
                                    setFromError(null);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} size={'small'} autoComplete={'off'}/>}
                        />
                    </LocalizationProvider>
                    {
                        fromError !== '' ?
                            <Typography variant={'caption'} sx={{color:'red'}}>
                                {fromError}
                            </Typography>:''
                    }
                </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                <Typography>
                    {'Family Members'}
                </Typography>
                <FormControl sx={{mt:1}}>
                    <Select
                        size={'small'}
                        multiple
                        value={selectedFamilyMembers?.map((e)=>e?.id)}
                        onChange={handleChange}
                        input={<OutlinedInput placeholder={'Select family member'}/>}
                        renderValue={(selected) => selectedFamilyMembers?.map((e)=>e?.name).join(', ')}
                        MenuProps={MenuProps}
                    >
                        {familyMembers?.filter((e)=>e?.status === 1).map((each) => (
                            <MenuItem key={each} value={each?.id}>
                                <Checkbox checked={selectedFamilyMembers?.map((e)=>e?.id).indexOf(each?.id) > -1} />
                                <ListItemText primary={each?.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                <Typography>
                    {'Request Type'}
                </Typography>
                <FormControl sx={{mt:1}}>
                    <Select
                        size={'small'}
                        value={selectedType}
                        onChange={(e) =>{setSelectedType(e.target.value);}}
                    >
                        <MenuItem value={'All'}>
                            {'Select a Type'}
                        </MenuItem>
                        {requestType.map((each) => (
                            <MenuItem key={each} value={each?.id}>
                                {each?.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
                <Typography>
                    {'Request Details'}
                </Typography>
                <TextField
                    size={'small'}
                    color="primary"
                    fullWidth
                    onChange={(event) => setDetails(event.target.value)}
                    type={'text'}
                    value={details}
                    variant="outlined"
                    multiline
                    rows={4}
                />
            </Box>
            <Button
                variant={'contained'}
                color={'primary'}
                fullWidth
                sx={{mt:3}}
                onClick={handleSubmit}
                disabled={
                    from === null||
                    value === null||
                    details === ''||
                    selectedType === ''||
                    selectedFamilyMembers?.length === 0||
                        subscriptionType === 'All'
                    ||
                        (subscriptionType === 2 &&selectedDay === 'All')
                    ||(subscriptionType === 3&&(selectDateOfAMonth !== 'Last Date'||selectedDate ===null))
                }
            >
                {'REQUEST SUBSCRIPTION'}
            </Button>
            <Dialog
                open={openDateDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={()=>{setOpenDateDialog(false);if (selectedDate === null){setSelectDateOfAMonth('All');}}}
                aria-describedby="alert-dialog-slide-description"
                maxWidth={'xs'}
                fullWidth
            >
                <DialogTitle>
                    {"Select a date"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {
                            NumberArray()?.map((e)=>(
                                <Grid item md={2} sm={2} lg={2} xs={2}>
                                    <Chip
                                        label={e}
                                        sx={selectedDate === e ?{backgroundColor:'#C3DEE3',boxShadow:2,'&:hover':{backgroundColor:'#C3DEE3'}}:{boxShadow:2}}
                                        onClick={()=>{setSelectedDate(e);setSelectDateOfAMonth('Select a date');setOpenDateDialog(false);}}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddSubscription;