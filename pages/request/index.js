import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import RequestsRow from "../../src/page-components/requests/RequestsRow";
import {useSnackbar} from "notistack";
import {ServiceRequestService} from "../../src/apis/rest.app";
import InfiniteScroll from '../../src/components/InfiniteScroll';
import EmptyText from "../../src/components/common/EmptyText/EmptyText";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import {useRouter} from "next/router";

export default function Index() {
    const [open,setOpen] = useState(false);
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false);
    const [allServiceRequest, setAllServiceRequest] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [each,setEach] = useState('');
    const [index,setIndex] = useState('');
    const Router = useRouter();
    const {filterType} = Router.query;
    console.log(filterType);

    const [selectedFilter, setSelectedFilter] = useState(filterType ?filterType:'All Requests');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const loadData = () => {
        setLoading(true);
        let data={
            $sort: {
                createdAt: -1,
            },
            $skip: allServiceRequest.length,
            $limit: 3,
            $eager:'[serviceType, careManager, familyMembers.[relation]]',
        }
        if (search !== ''){
            data={
                ...data,
                'requestId[$like]': `%${search}%`
            }
        }
        if (selectedFilter !== 'All Requests'){
            data={
                ...data,
                'status[$in]':selectedFilter === 'Pending'?1:selectedFilter === 'Accepted'?2:selectedFilter === 'Completed'?3:4
            }
        }
        ServiceRequestService.find({
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
                        placeholder='Search request'
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
                            id="basic-button"
                            aria-controls={openMenu ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                            onClick={handleClick}

                            sx={{
                                gap: "0.5rem",
                                color: 'primary.main',
                                "&:hover": {
                                    background: "transparent"
                                },
                                mr:2
                            }}> <img alt={'Image'} src={'/images/icons/filter_icon.svg'} height={10} width={20} />{selectedFilter}</Button>
                        <Button color='primary' variant='contained' onClick={async () => {
                            await setOpen(true);
                            await setEach('');
                            await setIndex('');
                        }}>REQUEST A SERVICE</Button>
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
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'DATE'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'FAMILY MEMBER'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'REQUEST TYPE'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'REQUEST'}</Typography>
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
                                        <RequestsRow
                                            each={e}
                                            index={i}
                                            setOpen={setOpen}
                                            setEach={setEach}
                                            setIndex={setIndex}
                                            setOpenDetailsDialog={setOpenDetailsDialog}
                                        />
                                    )) :
                                    loading ? (
                                            ''
                                        ) :
                                        (
                                            <EmptyText text={'No Requests found'} />
                                        )
                            }
                        </InfiniteScroll>
                    </Paper>
                </Box>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={'requests'}
                data={allServiceRequest}
                setData={setAllServiceRequest}
                each={each}
                index={index}
                setEach={setEach}
                setIndex={setIndex}
            />
            <AllForOneDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                componentName={'requests-details'}
                data={allServiceRequest}
                setData={setAllServiceRequest}
                each={each}
                index={index}
                setEach={setEach}
                setIndex={setIndex}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('All Requests');
                        setAllServiceRequest([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    All Requests
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Pending');
                        setAllServiceRequest([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Pending
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Accepted');
                        setAllServiceRequest([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Accepted
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Completed');
                        setAllServiceRequest([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Completed
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Canceled');
                        setAllServiceRequest([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Canceled
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
