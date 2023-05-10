import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, MenuItem, Select, TextField, Typography} from "@mui/material";
import {MenuCategoryService, MenuItemService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const AddEditMenuItem = ({each, index, setOpen, setData, data, openDialog}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('');
    const [type, setType] = useState(null);
    const [dietContext, setDietContext] = useState(null);
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [feePercentage, setFeePercentage] = useState('');
    const types = ["Starter", "Main Course", "Deserts", "Beverages", "Add Ons"];
    const dietContexts = ["Veg", "Non veg", "Vegan", "Pure veg"];
    const [variants, setVariants] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);
    const [menuCategory, setMenuCategory] = useState(null);


    useEffect(() => {
        if (each) {
            setType(each?.name);
            setDescription(each?.description);
        }

        /// getting all menu categories
        MenuCategoryService.find({
            query: {
                $limit: -1
            },
        })
            .then((response) => {
                setMenuCategories(response)
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
            });
    }, [each]);

    const handleSubmit = async () => {
        if (each) {
            setLoading(true);
            await MenuCategoryService.patch(each?.id, {
                "name": type,
                "description": description,
                "avatar": "",
            })
                .then(async (res) => {
                    setData(([...datum]) => {
                        datum[index] = res;
                        return datum;
                    });
                    setOpen(false);
                    setLoading(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        } else {
            const body = {
                "name": name,
                "description": description,
                "avatar": "https://uploads-ssl.webflow.com/5c481361c604e53624138c2f/60f2ea67b471327a1d82959b_chicken%20roll_1500%20x%201200.jpg",
                "type": type + 1,
                "dietContext": dietContext + 1,
                "variants": variants.map((e) => {
                    return {
                        title: e.title,
                        price: parseInt(e.price),
                    }
                }),
                "menuItemCategory": menuCategory,
            }
            setLoading(true);
            await MenuItemService.create(body)
                .then(async (res) => {
                    setLoading(false);
                    setData([res, ...data]);
                    enqueueSnackbar('Menu item added successfully', {variant: 'success'});
                    setOpen(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        }
    };


    const editTitle = async (index, value) => {
        let temp = variants
        temp[index]['title'] = value
        setVariants([...temp])
    }

    const editPrice = async (index, value) => {
        let temp = variants
        temp[index].price = value
        setVariants([...temp])
    }

    const addVariant = async () => {
        setVariants([
            ...variants,
            {
                title: "",
                price: ""
            }
        ]);
    }

    return (
        <>
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                <Typography sx={{fontWeight: 600}}>
                    {each ? 'Edit Menu Item' : 'Add Menu Item'}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor: 'pointer'}}
                     onClick={() => setOpen(false)}/>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                <Typography>
                    {'Title'}
                </Typography>
                <TextField
                    placeholder={'name'}
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    variant="outlined"
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Description'}
                </Typography>
                <TextField
                    placeholder={'description'}
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                    variant="outlined"
                    multiline
                    rows={4}
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Food type'}
                </Typography>
                <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    displayEmpty
                    inputProps={{'aria-label': 'Without label'}}
                >
                    <MenuItem value={null}>
                        <em>Select</em>
                    </MenuItem>
                    {
                        types?.map((e) => {
                            return <MenuItem value={types.indexOf(e)}>{e}</MenuItem>
                        })
                    }
                </Select>
            </Box>

            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Diet Context'}
                </Typography>
                <Select
                    value={dietContext}
                    onChange={(e) => setDietContext(e.target.value)}
                    displayEmpty
                    inputProps={{'aria-label': 'Without label'}}
                >
                    <MenuItem value={null}>
                        <em>Select</em>
                    </MenuItem>
                    {
                        dietContexts?.map((e) => {
                            return <MenuItem value={dietContexts.indexOf(e)}>{e}</MenuItem>
                        })
                    }
                </Select>
            </Box>

            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Menu Category'}
                </Typography>
                <Select
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    displayEmpty
                    inputProps={{'aria-label': 'Without label'}}
                >
                    <MenuItem value={null}>
                        <em>Select</em>
                    </MenuItem>
                    {
                        menuCategories?.map((e) => {
                            return <MenuItem value={e._id}>{e.name}</MenuItem>
                        })
                    }
                </Select>
            </Box>

            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Variants'}
                </Typography>
                {
                    variants?.map((e, i) => {
                        return <Box display={'flex'} flexDirection={'row'} width={'100%'} mt={i === 0 ? 0 : 1.5}>
                            <TextField
                                placeholder={'title'}
                                size={'small'}
                                color={'primary'}
                                fullWidth
                                onChange={(event) => editTitle(i, event.target.value)}
                                value={e.title}
                                variant="outlined"
                            />
                            <Box width={0.05}/>
                            <TextField
                                placeholder={'price'}
                                size={'small'}
                                color={'primary'}
                                fullWidth
                                onChange={(event) => editPrice(i, event.target.value)}
                                value={e.price}
                                variant="outlined"
                            />
                        </Box>
                    })
                }

                <Button
                    sx={{mt: variants.length > 0 ? 1.5 : 1}}
                    fullWidth
                    color="primary"
                    variant={'outlined'}
                    onClick={addVariant}
                >
                    {'Add variant'}
                </Button>
            </Box>


            {/*<Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>*/}
            {/*    <Typography sx={{mb: 0.5}}>*/}
            {/*        {'Fee Percentage'}*/}
            {/*    </Typography>*/}
            {/*    <TextField*/}
            {/*        size={'small'}*/}
            {/*        color={'primary'}*/}
            {/*        fullWidth*/}
            {/*        onChange={(event) => {*/}
            {/*            setFeePercentage(event.target.value);*/}
            {/*        }}*/}
            {/*        value={feePercentage}*/}
            {/*        variant="outlined"*/}
            {/*    />*/}
            {/*</Box>*/}
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                <Button
                    fullWidth
                    color="primary"
                    disabled={loading || name === '' || menuCategory === '' || variants.length === 0 || type === null || dietContext === null}
                    variant={'contained'}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24}/> : each ? 'SAVE CHANGES' : 'ADD'}
                </Button>
            </Box>
        </>
    );
};

export default AddEditMenuItem;