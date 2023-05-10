import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Grid, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import {useSnackbar} from "notistack";
import {useRouter} from "next/router";
import {serviceRequestManagementService} from "../../src/apis/rest.app";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import EmptyText from "../../src/components/common/EmptyText/EmptyText";
import InfiniteScroll from '../../src/components/InfiniteScroll';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TransactionRow from "../../src/page-components/transactions/TransactionRow";
import moment from "moment";

export default function Index() {
    const [open,setOpen] = useState(false);
    const [search,setSearch] = useState('');
    const [from,setFrom] = useState(null);
    const [fromError,setFromError] = useState(null);
    const [to,setTo] = useState(null);
    const [toError,setToError] = useState(null);
    const [allTransaction, setAllTransaction] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [each,setEach] = useState('');
    const [index,setIndex] = useState('');

    const openDialog = () =>{
        setOpen(false);
        setEach('');
        setIndex('');
    }

    const Router = useRouter();
    const loadData = () => {
        setLoading(true);
        let data={
            $sort: {
                createdAt: -1,
            },
            $skip: allTransaction.length,
            $limit: 3,
            $eager:'[serviceType,user,transaction,familyMembers.[relation]]'
        }
        if (search !== '') {
            data = {
                ...data,
                'serviceLogId[$like]': `%${search}%`
            }
        }
        if (from !== null&& to!== null){
            data ={
                ...data,
                'createdAt[$lte]':new Date(to),
                'createdAt[$gte]':new Date(from)
            }
        }
        serviceRequestManagementService.find({
            query: {
                ...data
            },
        })
            .then((response) => {
                const { data, total } = response;
                const allData = [...allTransaction, ...data];
                setHasMore(allData.length < total);
                setAllTransaction([...allData]);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(() =>{
        if (from !== null&& to!== null){
            setAllTransaction([]);
            setHasMore(true);
        }
    },[from,to]);

    return (
        <React.Fragment>
            <>
                <Box mt={2} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: "0px 1.5rem 0px 1.5rem",
                    }}
                >
                   <TextField
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setHasMore(true);
                                setAllTransaction([]);
                            }}
                            color="primary"
                            variant="outlined"
                            placeholder='Search service log id'
                            size="small"
                            type={'text'}
                            autoComplete={'off'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <img alt={'Image'} src={'/images/icons/Search.svg'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                    <Box display={'flex'} alignItems={'center'}>
                        <Box display={'flex'} flexDirection={'column'}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    inputFormat={from ===null?'From': 'DD/MM/YYYY'}
                                    onError={(t,r) =>{
                                        if (t !== null || t=== 'invalidDate'){
                                            setFromError('Please provide a valid date');
                                        }
                                    }}
                                    value={from}
                                    onChange={(newValue) => {
                                        console.log(moment(new Date(newValue)).format('L'));
                                        if (new Date(newValue).toString() === 'Invalid Date'){
                                            setFromError('Please provide a valid date');
                                        }else {
                                            setFrom(newValue);
                                            setFromError(null);
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} size={'small'} sx={{width:'170px'}} autoComplete={'off'}/>}
                                />
                            </LocalizationProvider>
                            {
                                fromError !== '' ?
                                    <Typography variant={'caption'} sx={{color:'red'}}>
                                        {fromError}
                                    </Typography>:''
                            }
                        </Box>
                        <Box width={'20px'} bgcolor={'#000'} height={'2px'} ml={1} mr={1}/>
                        <Box display={'flex'} flexDirection={'column'}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    inputFormat={to ===null?'To': 'DD/MM/YYYY'}

                                    disabled={from === null}
                                    onError={(t,r) =>{
                                        if (t !== null || t=== 'invalidDate'){
                                            setToError('Please provide a valid date');
                                        }
                                    }}
                                    value={to}
                                    onChange={(newValue) => {
                                        if (new Date(newValue).toString() === 'Invalid Date'){
                                            setToError('Please provide a valid date');
                                        }else {
                                            setTo(newValue);
                                            setToError(null);
                                        }
                                    }}
                                    minDate={from}
                                    renderInput={(params) => <TextField {...params} size={'small'} sx={{width:'170px'}} autoComplete={'off'}/>}
                                />
                            </LocalizationProvider>
                            {
                                toError !== '' ?
                                    <Typography variant={'caption'} sx={{color:'red'}}>
                                        {toError}
                                    </Typography>:''
                            }
                        </Box>
                    </Box>
                </Box>
                <Box mt={2}>
                    <Paper sx={{
                        background: "#FFFFFF",
                        boxShadow: " 0px 8px 20px rgba(0, 0, 0, 0.05)",
                        borderRadius: "16px",
                        padding: "16px 24px",
                        textAlign: 'center'
                    }}
                    >
                        <Box sx={{
                            backgroundColor: '#E6E6E6',
                            padding: "16px 24px",
                            borderRadius: "12px",

                        }}>
                            <Grid container>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600} >{'ID'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'DATE'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'SERVICE TYPE'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'SERVICE DETAILS'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'AMOUNT'}</Typography>
                                </Grid>

                            </Grid>
                        </Box>

                        <InfiniteScroll
                            hasMore={hasMore}
                            loadMore={loadData}
                            loader={<CircularProgress size={25} />}
                            pageStart={0}
                        >
                            {
                                allTransaction?.length > 0 ? allTransaction?.map((e, i) => (
                                        <TransactionRow
                                            each={e}
                                            index={i}
                                            setIndex={setIndex}
                                            setEach={setEach}
                                            setOpen={setOpen}
                                        />
                                    )) :
                                    loading ? (
                                            ''
                                        ) :
                                        (
                                            <EmptyText text={'No Transactions found'} />
                                        )
                            }
                        </InfiniteScroll>
                    </Paper>
                </Box>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={'Transaction'}
                each={each}
                index={index}
                openDialog={openDialog}
                setIndex={setIndex}
                setEach={setEach}
            />
        </React.Fragment>
    );
}
