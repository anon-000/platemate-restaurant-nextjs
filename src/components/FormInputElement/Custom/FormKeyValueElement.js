import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Autocomplete, Box, Button, Chip, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {BrandService} from "../../../apis/rest.app";
import useHandleError from "../../../hooks/useHandleError";
import {Delete, Visibility, VisibilityOff} from "@mui/icons-material";
import {position} from "stylis";

const FormKeyValueElement = ({ label, selected, setSelected}) => {

    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    return(
        <Stack spacing={1}>
            <Typography variant={'body2'}>
                {label}
            </Typography>
            <Stack direction="row" spacing={1}>
                <TextField
                    color={'primary'}
                    fullWidth
                    label={'Key'}
                    size={'small'}
                    onChange={(event) => setKey(event.target.value)}
                    value={key}
                    variant="outlined"
                />
                <TextField
                    color={'primary'}
                    fullWidth
                    label={'Value'}
                    size={'small'}
                    onChange={(event) => setValue(event.target.value)}
                    value={value}
                    variant="outlined"
                />
                <Button
                    disabled={!((key && key.length>0) && (value && value.length>0))}
                    variant={'contained'}
                    color={'secondary'}
                    onClick={() => {
                        let _selected = selected;
                        _selected.push({key,value});
                        setSelected([..._selected]);
                        setKey('');
                        setValue('');
                    }}
                >
                    Add
                </Button>
            </Stack>
            <Stack direction={'row'} width={'100%'} flexWrap={'wrap'}>
                {
                    selected && selected.length ?
                        selected.map( (each, pos) =>
                            <Box display={'flex'} width={'100%'} alignItems={'center'}>
                                <Typography flex={1}>
                                    {each.key}
                                </Typography>
                                <Typography>
                                    :
                                </Typography>
                                <Typography flex={1} sx={{marginLeft: 1}}>
                                    {each.value}
                                </Typography>
                                <IconButton onClick={() => {
                                    let _selected = selected;
                                    _selected.splice(pos, 1);
                                    setSelected([..._selected]);
                                }}>
                                    <Delete />
                                </IconButton>
                            </Box> )
                        : <></>
                }
            </Stack>

        </Stack>
    );
};

FormKeyValueElement.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
};


export default FormKeyValueElement;
