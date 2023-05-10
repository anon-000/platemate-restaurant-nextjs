import React, {useState} from "react";
import {useSnackbar} from "notistack";
import {useRouter} from "next/router";
import {useUser} from "../../src/store/UserContext";
import {MenuCategoryService} from "../../src/apis/rest.app";
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
import InfiniteScroll from "react-infinite-scroller";
import AllForOneDialog from "../../src/page-components/AllForOneDialog";
import EmptyText from "../../src/components/common/EmptyText/EmptyText";
import MenuCategoryRow from "../../src/page-components/menu-categories/MenuCategoryRow";

const Index = () => {
    const [open, setOpen] = useState(false);
    const [allServices, setAllServices] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const [each, setEach] = useState('');
    const [index, setIndex] = useState('');
    const [user, setUser] = useUser();

    const loadData = () => {
        setLoading(true);
        let data = {
            $sort: {
                createdAt: -1,
            },
            $skip: allServices.length,
            $limit: 3
        }
        if (search !== '') {
            data = {
                ...data,
                'serviceTypeId[$like]': `%${search}%`
            }
        }
        MenuCategoryService.find({
            query: {
                ...data
            },
        })
            .then((response) => {
                const {data, total} = response;
                const allData = [...allServices, ...data];
                setHasMore(allData.length < total);
                setAllServices([...allData]);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                setLoading(false);
            });
    };

    const openDialog = () => {
        setOpen(false);
        setEach('');
        setIndex('');
    }

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
                            setAllServices([]);
                            setHasMore(true);
                        }}
                        color="primary"
                        variant="outlined"
                        placeholder='Search menu categories'
                        size="small"
                        type={'text'}
                        autoComplete={'off'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <img alt={'Image'} src={'/images/icons/Search.svg'}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {
                        <Button color='primary' variant='contained' onClick={() => {
                            setOpen(true);
                            setEach('');
                            setIndex('');
                        }}>ADD MENU CATEGORY</Button>
                    }

                </Box>

                <Box mt={2}/>
                <Box mt={2}>
                    <Paper
                        sx={{
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
                                <Grid item xs={1}>
                                    <Typography variant='body2' color={'#403D26'}
                                                fontWeight={600}>{'Sl no.'}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body2' color={'#403D26'}
                                                fontWeight={600}>{'Name'}</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant='body2' color={'#403D26'}
                                                fontWeight={600}>{'Description'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body2' color={'#403D26'}
                                                fontWeight={600}>{'Status'}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                        <InfiniteScroll
                            hasMore={hasMore}
                            loadMore={loadData}
                            loader={<CircularProgress size={25}/>}
                            pageStart={0}
                        >
                            {
                                allServices?.length > 0 ? allServices?.map((e, i) => (
                                        <MenuCategoryRow each={e}
                                                         index={i}
                                                         setAllServices={setAllServices}
                                                         allServices={allServices}
                                                         setIndex={setIndex}
                                                         setEach={setEach}
                                                         setOpen={setOpen}
                                        />
                                    )) :
                                    loading ? (
                                            ''
                                        ) :
                                        (
                                            <EmptyText text={'No services category found'}/>
                                        )
                            }
                        </InfiniteScroll>
                    </Paper>
                </Box>
            </>
            <AllForOneDialog
                open={open}
                setOpen={setOpen}
                componentName={'service'}
                data={allServices}
                setData={setAllServices}
                index={index}
                each={each}
                openDialog={openDialog}
            />
        </React.Fragment>
    );
};

export default Index;