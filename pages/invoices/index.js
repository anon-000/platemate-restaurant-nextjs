import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment, Menu, MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import InvoiceRow from "../../src/page-components/invoices/InvoiceRow";
import {useSnackbar} from "notistack";
import {InvoiceService} from "../../src/apis/rest.app";
import InfiniteScroll from '../../src/components/InfiniteScroll';
import EmptyText from "../../src/components/common/EmptyText/EmptyText";
import {useUser} from "../../src/store/UserContext";

export default function Index() {
    const [open,setOpen] = useState(false);
    const [allInvoice, setAllInvoice] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [each, setEach] = useState('');
    const [index, setIndex] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const [selectedFilter, setSelectedFilter] = useState('All');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [user] = useUser();


    const loadData = () => {
        setLoading(true);
        let data={
            $sort: {
                createdAt: -1,
            },
            $skip: allInvoice.length,
            $limit: 3,
            // $eager:'[user, serviceType, familyMembers.[relation]]'
        }
        if (search !== ''){
            data={
                ...data,
                'invoiceId[$like]': `%${search}%`
            }
        }
        if (selectedFilter !== 'All'){
            data={
                ...data,
                'status[$in]':selectedFilter === 'Pending'?1:2
            }
        }
        InvoiceService.find({
            query: {
                ...data
            },
        })
            .then((response) => {
                const { data, total } = response;
                const allData = [...allInvoice, ...data];
                setHasMore(allData.length < total);
                setAllInvoice([...allData]);
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
                            setAllInvoice([]);
                            setHasMore(true);
                        }}
                        color="primary"
                        variant="outlined"
                        placeholder='Search invoice id'
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
                        <Box width={'100%'} display={'flex'} justifyContent={'space-between'} mb={2}>
                            <Box display={'flex'} alignItems={'center'}>
                                <img src={'/images/icons/money-icon.svg'} alt={'Image'}/>
                                <Typography sx={{ml:2}}>
                                    {'Outstanding Amount :'}
                                </Typography>
                                <Typography fontWeight={700} sx={{ml:2}}>
                                    {`$${user?.wallet?.amount}`}
                                </Typography>
                            </Box>
                            {/*<Box>*/}
                            {/*    <Button variant={'contained'} color={'primary'}>*/}
                            {/*        {'PAY ALL INVOICES'}*/}
                            {/*    </Button>*/}
                            {/*</Box>*/}
                        </Box>
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
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'DATE GENERATED'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'MONTH'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <Typography variant='body2' color={'#403D26'} fontWeight={600}>{'AMOUNT PAYABLE'}</Typography>
                                </Grid>
                                <Grid item xs={2.4}>
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
                                allInvoice?.length > 0 ? allInvoice?.map((e, i) => (
                                        <InvoiceRow each={e} index={i} setOpen={setOpen} setEach={setEach} setIndex={setIndex}/>
                                    )) :
                                    loading ? (
                                            ''
                                        ) :
                                        (
                                            <EmptyText text={'No Invoice found'} />
                                        )
                            }
                        </InfiniteScroll>
                    </Paper>
                </Box>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={'invoice'}
                index={index}
                each={each}
                setData={setAllInvoice}
                data={allInvoice}
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
                        setSelectedFilter('All');
                        setAllInvoice([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    All
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Pending');
                        setAllInvoice([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Pending
                </MenuItem>
                <MenuItem
                    onClick={()=> {
                        setSelectedFilter('Paid');
                        setAllInvoice([]);
                        setHasMore(true);
                        handleClose();
                    }}
                >
                    Paid
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
