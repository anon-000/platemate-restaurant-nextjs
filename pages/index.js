import React, {useEffect, useState} from 'react';
import { Line} from 'react-chartjs-2';
import {useSnackbar} from 'notistack';
import {Box, Grid, Paper, Typography} from "@mui/material";
import {RestaurantDashboardService, UserDashboardService} from "../src/apis/rest.app";
import {useUser} from "../src/store/UserContext";
import {useRouter} from "next/router";

const Index = () => {
    const [user] = useUser();
    const Router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [dashboardData, setDashboardData] = useState();
    const [dashboardDataLoading, setDashboardDataLoading] = useState();
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const [transactionFilter,setTransactionFilter] = useState(0);
    const [serviceFilter,setServiceFilter] = useState(0);
    const filterType = ['weekly','monthly','yearly']

    useEffect(()=>{
        if (!user) return;
        console.log('hii',user);
        setDashboardDataLoading(true);
        let data={
            "numberStatistics": true,
            "serviceRequestGraphStatistics": filterType[serviceFilter],
            "transactionsGraphStatistics": filterType[transactionFilter]
        }
        RestaurantDashboardService.create({...data})
            .then((res)=>{
                setDashboardData(res);
            })
            .catch((e)=>{
                enqueueSnackbar(e ? e.message : 'Something went wrong', {
                    variant: 'error'
                });
            })
            .finally(()=>{
                setDashboardDataLoading(false);
            });
    }, [transactionFilter,serviceFilter]);

    const serviceData = (canvas) => {
        const ctx = canvas.getContext('2d');

        //1. Using gradient background.
        let gradient = ctx.createLinearGradient(50, 210, 55, 100);
        gradient.addColorStop(0, 'rgba(180, 201, 255, 0)');
        gradient.addColorStop(1, 'rgba(180, 210, 255, 1)');

        return {
            labels: dashboardData?.serviceRequestGraphStatistics?.map((each) => each?.value),
            datasets: [
                {
                    fill: true,
                    borderColor: '#2851BA',
                    // label:'# of votes',
                    data: dashboardData?.serviceRequestGraphStatistics?.map((each) => each?.totalRequests),
                    backgroundColor: gradient,
                    pointRadius: 3,
                    pointBackgroundColor: '#2851BA',
                },
            ],
        };
    };

    const transactionData = (canvas) => {
        const ctx = canvas.getContext('2d');

        //1. Using gradient background.
        let gradient = ctx.createLinearGradient(50, 210, 55, 100);
        gradient.addColorStop(0, 'rgba(180, 201, 255, 0)');
        gradient.addColorStop(1, 'rgba(180, 210, 255, 1)');

        return {
            labels: dashboardData?.transactionsGraphStatistics?.map((each) => each?.value),
            datasets: [
                {
                    fill: true,
                    borderColor: '#2851BA',
                    // label:'# of votes',
                    data: dashboardData?.transactionsGraphStatistics?.map((each) => each?.totalTransaction),
                    backgroundColor: gradient,
                    pointRadius: 3,
                    pointBackgroundColor: '#2851BA',
                },
            ],
        };
    };

    const card = [
        {
            img:'/images/icons/pending_request.svg',
            title:'Pending Orders',
            value:dashboardData?.totalPendingRequests,
            href:'/orders?filterType=Pending'
        },{
            img:'/images/icons/complete_requests.svg',
            title:'Completed Orders',
            value:dashboardData?.totalCompletedRequests,
            href:'/orders?filterType=Completed'
        },{
            img:'/images/icons/total_users.svg',
            title:'Menu Items',
            value:dashboardData?.totalFamilyMembers,
            href:'/menu-items'
        },{
            img:'/images/icons/transaction_worth.svg',
            title:'Transaction worth',
            value:dashboardData?.totalTransactionWorth,
            href:'/'
        },
    ]

    return(
        <>
            <Box mt={1}>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={6} xs={12}>
                        <Grid container spacing={2}>
                            {
                                card?.map((e,i) =>(
                                    <Grid item md={6} sm={6} xs={12} >
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            flexDirection={'column'}
                                            bgcolor={'#FFFFF'}
                                            borderRadius={3}
                                            boxShadow={1}
                                            p={3}
                                            height={190}
                                            onClick={() =>{Router.push(e?.href);}}
                                            sx={{cursor:'pointer'}}
                                        >
                                            <img src={e?.img} alt={'Image'}/>
                                            <Typography sx={{mt:1,color:i === 0 ?'#F5993D':'#508CD2'}}>
                                                {e?.title}
                                            </Typography>
                                            <Typography sx={{mt:1.5}}>
                                                {e?.value||0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Paper component={Box} height={387}>
                            <Box p={3}>
                                <Box display={'flex'} alignItems={'center'} >
                                    <Box flexGrow={1}>
                                        <Typography> Transaction</Typography>
                                    </Box>
                                    <Box display={'flex'}>
                                        <img
                                            src={'/images/icons/Vector (6).svg'}
                                            alt={'left arrow'}
                                            style={transactionFilter >= 1 ?{cursor:'pointer'}:{pointerEvents:'none'}}
                                            onClick={()=>{
                                                setTransactionFilter(transactionFilter-1);
                                            }}
                                        />
                                        <Typography sx={{ml:1,mr:1}} variant={'body2'}>
                                            {filterType[transactionFilter]}
                                        </Typography>
                                        <img
                                            src={'/images/icons/Vector (7).svg'}
                                            alt={'left arrow'}
                                            style={transactionFilter <= 1 ?{cursor:'pointer'}:{pointerEvents:'none'}}
                                            onClick={()=>{
                                                setTransactionFilter(transactionFilter+1);
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    <Line
                                        data={transactionData}
                                        width={439}
                                        height={222}
                                        legend={false}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={3} mt={1}>
                    <Grid item md={12} sm={12} xs={12}>
                        <Paper component={Box} height={'100%'}>
                            <Box p={3}>
                                <Box display={'flex'} alignItems={'center'} >
                                    <Box flexGrow={1}>
                                        <Typography> Orders</Typography>
                                    </Box>
                                    <Box display={'flex'}>
                                        <img
                                            src={'/images/icons/Vector (6).svg'}
                                            alt={'left arrow'}
                                            style={serviceFilter >= 1 ?{cursor:'pointer'}:{pointerEvents:'none'}}
                                            onClick={()=>{
                                                setServiceFilter(serviceFilter-1);
                                            }}
                                        />
                                        <Typography sx={{ml:1,mr:1}} variant={'body2'}>
                                            {filterType[serviceFilter]}
                                        </Typography>
                                        <img
                                            src={'/images/icons/Vector (7).svg'}
                                            alt={'left arrow'}
                                            style={serviceFilter <= 1 ?{cursor:'pointer'}:{pointerEvents:'none'}}
                                            onClick={()=>{
                                                setServiceFilter(serviceFilter+1);
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    <Line
                                        data={serviceData}
                                        width={439}
                                        height={222}
                                        legend={false}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Index;