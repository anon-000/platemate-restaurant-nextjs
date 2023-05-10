import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useSnackbar} from "notistack";
import {SubscriptionService} from "../../src/apis/rest.app";
import InfiniteScroll from '../../src/components/InfiniteScroll';
import EmptyText from "../../src/components/common/EmptyText/EmptyText";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import SubscriptionRow from "../../src/page-components/subscription/SubscriptionRow";

export default function Index() {
    const [open,setOpen] = useState(false);
    const [allServiceRequest, setAllServiceRequest] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [each,setEach] = useState('');
    const [index,setIndex] = useState('');
    const [whatToOpen,setWhatToOpen] = useState('');

    const loadData = () => {
        setLoading(true);
        let data={
            $sort: {
                createdAt: -1,
            },
            $skip: allServiceRequest.length,
            $limit: 3,
            $eager:'[familyMembers.[relation],serviceType]',
        }
        if (search !== ''){
            data={
                ...data,
                'requestId[$like]': `%${search}%`
            }
        }

        SubscriptionService.find({
            query: {
                ...data
            },
        })
            .then((response) => {
                const { data, total } = response;
                const allData = [...allServiceRequest, ...data];
                setHasMore(allData.length < total);
                setAllServiceRequest([...allData]);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                setLoading(false);
            });
    };

    const closeDialog = () =>{
      setOpen(false);
      setEach('');
      setIndex('');
      setWhatToOpen('');
    };

    return (
        <React.Fragment>
            <>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: "0px 1.5rem 0px 1.5rem"
                    }}
                >
                    <TextField
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setAllServiceRequest([]);
                            setHasMore(true);
                        }}
                        color="primary"
                        variant="outlined"
                        placeholder='Search subscription request'
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
                    <Box display={'flex'}>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={async () => {
                                await setOpen(true);
                                await setEach('');
                                await setIndex('');
                                await setWhatToOpen('add-subscription');
                            }}
                        >
                            REQUEST A SUBSCRIPTION
                        </Button>
                    </Box>
                </Box>

                <Box mt={2} />

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
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600} >{'ID'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'FAMILY MEMBER'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'SERVICE TYPE'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'SUBSCRIPTION TYPE'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'END DATE'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
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
                                allServiceRequest?.length > 0 ? allServiceRequest?.map((e, i) => (
                                        <SubscriptionRow
                                            each={e}
                                            index={i}
                                            setOpen={setOpen}
                                            setEach={setEach}
                                            setIndex={setIndex}
                                            setWhatToOpen={setWhatToOpen}
                                        />
                                    )) :
                                    loading ? (
                                            ''
                                        ) :
                                        (
                                            <EmptyText text={'No subscription request found'} />
                                        )
                            }
                        </InfiniteScroll>
                    </Paper>
                </Box>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={whatToOpen}
                data={allServiceRequest}
                setData={setAllServiceRequest}
                each={each}
                index={index}
                setEach={setEach}
                setIndex={setIndex}
                openDialog={closeDialog}
            />
        </React.Fragment>
    );
}
