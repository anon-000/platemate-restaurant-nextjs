import React, {useState} from 'react';
import {Box, Button, CircularProgress, Grid, Paper, TextField, Typography} from "@mui/material";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import SupportRow from "../../src/page-components/support/SupportRow";
import {useSnackbar} from "notistack";
import {SupportService} from "../../src/apis/rest.app";
import InfiniteScroll from '../../src/components/InfiniteScroll';
import EmptyText from "../../src/components/common/EmptyText/EmptyText";

export default function Index() {
    const [open,setOpen] = useState(false);
    const [allSupportRequests, setAlSupportRequest] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [each,setEach] = useState('');
    const [index,setIndex] = useState('');
    const [query,setQuery] = useState('');
    const [supportLoading,setSupportLoading] = useState(false);

    const loadData = () => {
        setLoading(true);
        SupportService.find({
            query: {
                $sort: {
                    createdAt: -1,
                },
                $skip: allSupportRequests.length,
                $limit: 3,
                $eager:'[user]'
            },
        })
            .then((response) => {
                const { data, total } = response;
                const allData = [...allSupportRequests, ...data];
                setHasMore(allData.length < total);
                setAlSupportRequest([...allData]);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                setLoading(false);
            });
    };

    const openDialog = () =>{
      setOpen(false);
      setEach('');
      setIndex('');
    };

    return (
        <React.Fragment>
            <>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Paper sx={{
                            background: "#FFFFFF",
                            boxShadow: " 0px 8px 20px rgba(0, 0, 0, 0.05)",
                            borderRadius: "16px",
                            padding: "16px 24px",
                        }}
                        >
                            <Box p={2} display={'flex'} flexDirection={'column'}>
                                <Typography variant={'body2'} fontWeight={600}>
                                    {'Send Support Query'}
                                </Typography>
                                <Typography sx={{mt:2}} variant={'caption'} fontWeight={600}>
                                    {'Query Details'}
                                </Typography>
                                <TextField
                                    size={'small'}
                                    autoFocus
                                    color="primary"
                                    fullWidth
                                    onChange={(event) => setQuery(event.target.value)}
                                    type={'email'}
                                    value={query}
                                    variant="outlined"
                                    placeholder={'enter query details here'}
                                    multiline
                                    rows={14}
                                />
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    sx={{mt:1}}
                                    disabled={query === ''}
                                    onClick={()=>{
                                        setSupportLoading(true);
                                        SupportService.create({query}).then((res) =>{
                                            setQuery('');
                                            setAlSupportRequest([res,...allSupportRequests]);
                                            setSupportLoading(false);
                                        }).catch((error) =>{
                                            enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                                            setSupportLoading(false);
                                        })
                                    }}
                                >
                                    {'SEND QUERY'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
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
                                        <Grid item xs={4}>
                                            <Typography variant='body2' color={'#403D26'} fontWeight={600} >{'DATE'}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'QUERY'}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'STATUS'}</Typography>
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
                                        allSupportRequests?.length > 0 ? allSupportRequests?.map((e, i) => (
                                                <SupportRow setOpen={setOpen} each={e} index={i} setEach={setEach} setIndex={setIndex}/>
                                            )) :
                                            loading ? (
                                                    ''
                                                ) :
                                                (
                                                    <EmptyText text={'No support requests found'} />
                                                )
                                    }
                                </InfiniteScroll>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={'support'}
                each={each}
                index={index}
                openDialog={openDialog}
                setAlSupportRequest={setAlSupportRequest}
                setEach={setEach}
                setIndex={setIndex}
            />
        </React.Fragment>
    );
}
