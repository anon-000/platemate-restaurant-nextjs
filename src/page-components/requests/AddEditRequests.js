import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Checkbox,
    FormControl, IconButton, InputAdornment,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {FamilyMemberService, RequestTypeService, ServiceRequestService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

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

const AddEditRequests = ({each,index,open,setOpen,setData,data,setEach,setIndex}) =>{
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

    const handleChangeTime = (newValue) => {
        if (new Date(newValue).toString() === 'Invalid Date'){
            setValueError('Please provide a valid time');
        }else {
            setValue(newValue);
            setValueError(null);
        }
    };

    console.log(each);

    useEffect(() =>{
       if (each){
           setDetails(each?.description);
           setRequestType(each?.serviceTypeId);
           setSelectedFamilyMembers(each?.familyMembers?.map((e) =>e?.id));
           setSelectedFamilyMembers(each?.familyMembers);
       }
    },[each]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedFamilyMembers([...familyMembers.filter((e) => value.some((id2 ) => id2 === e?.id))]);
    };

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    const handleSubmit = async () => {
        if (each) {
            setLoading(true);
            await FamilyMemberService.patch(each?.id, {
                "name": values?.name,
                "phone": values?.phone,
                "avatar": _image,
                "relationType": values?.relationType,
                "address": {
                    "addressLine1": values?.addressLine1,
                    "city": values?.city,
                    "state": values?.state,
                    "pinCode": values?.pinCode
                }
            })
                .then(async (res) => {
                    setData(([...datum]) =>{
                        datum[index] = res;
                        return datum;
                    });
                    setOpen(false);
                    setLoading(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                    setLoading(false);
                });
        } else {
            setLoading(true);
            await ServiceRequestService.create({
                "requestScheduledOn": CombineDateAndTime(new Date(from),new Date(value)),
                "serviceTypeId": selectedType,
                "description": details,
                "familyMemberIds": selectedFamilyMembers?.map((e) =>e?.id)
            },{query:{$eager:'[serviceType, careManager, familyMembers.[relation]]'}})
                .then(async (res) => {
                    setLoading(false);
                    setData([res,...data]);
                    enqueueSnackbar('Service request added successfully', { variant: 'success' });
                    setOpen(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                    setLoading(false);
                });
        }
    };

    function CombineDateAndTime(date, time) {
        const mins = ("0"+ time.getMinutes()).slice(-2);
        const hours = ("0"+ time.getHours()).slice(-2);
        const timeString = hours + ":" + mins + ":00";
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const dateString = "" + year + "-" + month + "-" + day;
        const datec = dateString + "T" + timeString;
        return new Date(datec);
    };

    useEffect(() =>{
        FamilyMemberService.find({
            query: {
                $sort: {
                    createdAt: -1,
                },
                $limit: -1,
                $eager:'[relation]',
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

    return(
        <>
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'} mb={2}>
                <Typography fontWeight={600}>
                    {`Request A Service`}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={()=>{setOpen(false);setEach('');setIndex('');}}/>
            </Box>
            <Box display={'flex'}>
                <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                    <Typography>
                        {'Date'}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            minDate={new Date()}
                            onError={(t,r) =>{
                                if (t !== null || t=== 'invalidDate'){
                                    setFromError('Please provide a valid date');
                                }
                            }}
                            placeholder="Basic example"
                            value={from}
                            onChange={(newValue) => {
                                console.log(new Date(newValue));
                                if (new Date(newValue).toString() === 'Invalid Date'){
                                    setFromError('Please provide a valid date');
                                }else {
                                    setFrom(newValue);
                                    setFromError(null);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} size={'small'}/>}
                        />
                    </LocalizationProvider>
                    {
                        fromError !== '' ?
                            <Typography variant={'caption'} sx={{color:'red'}}>
                                {fromError}
                            </Typography>:''
                    }
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} ml={2} mt={3}>
                    <Button variant={'outlined'} color={'primary'} onClick={()=>setFrom(mm + '/' + dd + '/' + yyyy)}>
                        {'TODAY'}
                    </Button>
                </Box>
            </Box>
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
                        renderInput={(params) => <TextField {...params} size={'small'}/>}
                    />
                </LocalizationProvider>
                {
                    valueError !== '' ?
                        <Typography variant={'caption'} sx={{color:'red'}}>
                            {valueError}
                        </Typography>:''
                }
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
                disabled={from === null||value === null||details === ''||selectedType === ''||selectedFamilyMembers?.length === 0}>
                {'REQUEST SERVICE'}
            </Button>
        </>
    );
};

export default AddEditRequests;