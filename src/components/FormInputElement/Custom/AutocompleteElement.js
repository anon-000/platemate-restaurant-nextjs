import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Autocomplete, Chip, TextField} from "@mui/material";
import useHandleError from "../../../hooks/useHandleError";
import {AmenitiesService, CategoryService} from "../../../apis/rest.app";

const AutocompleteElement = ({  displayName,label, selected,setSelected,service, keyVal  }) => {


    // console.log({  displayName,label, selected,setSelected,service, keyVal  });
    const [data, setData] = useState([]);
    const handleError = useHandleError();

    useEffect(() => {
        service.find({
            query: {
                $limit: -1,
                status: 1,
            },
        })
            .then((response) => {
                // console.log('res.....',response);
                setData([...response]);
            })
            .catch((error) => {
                handleError()(error);
            });
    }, []);

    return(
        <Autocomplete
            multiple
            id="tags-outlined"
            options={data}
            getOptionLabel={(option) => option[displayName]}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    size={'small'}
                    placeholder="Type anything to Search"
                />
            )}
            value={data.filter(e => selected.filter(_e => _e === e[keyVal]).length > 0)}
            onChange={(event, newValue) => {
                setSelected([
                    ...(newValue.map(e => e[keyVal]))
                ]);
            }}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option[displayName]}
                        {...getTagProps({ index })}
                    />
                ))
            }

        />
    );
};

AutocompleteElement.propTypes = {
    service: PropTypes.any.isRequired,
    displayName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
};


export default AutocompleteElement;
