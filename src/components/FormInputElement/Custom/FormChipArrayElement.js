import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Autocomplete, Box, Button, Chip, IconButton, InputAdornment, Stack, TextField} from "@mui/material";
import {BrandService} from "../../../apis/rest.app";
import useHandleError from "../../../hooks/useHandleError";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {position} from "stylis";

const FormChipArrayElement = ({ label, selected, setSelected}) => {

    const [data, setData] = useState('');

    return(
        <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
                <TextField
                    color={'primary'}
                    fullWidth
                    label={label}
                    size={'small'}
                    onChange={(event) => setData(event.target.value)}
                    value={data}
                    variant="outlined"
                />
                <Button
                    disabled={!(data&&data.length>0)}
                    variant={'contained'}
                    color={'secondary'}
                    onClick={() => {
                        let _selected = selected;
                        _selected.push(data);
                        setSelected([..._selected]);
                        setData('');
                    }}
                >
                    Add
                </Button>
            </Stack>
            <Stack direction={'row'} spacing={1} width={'100%'} flexWrap={'wrap'}>
                {
                    selected && selected.length ?
                        selected.map( (each, pos) =>
                            <Chip
                                label={each}
                                variant={'outlined'}
                                sx={{marginBottom: 1}}
                                onDelete={() => {
                                    let _selected = selected;
                                    _selected.splice(pos, 1);
                                    setSelected([..._selected]);
                                }}
                            />)
                        : <></>
                }
            </Stack>

        </Stack>
    );
};

FormChipArrayElement.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
};


export default FormChipArrayElement;
