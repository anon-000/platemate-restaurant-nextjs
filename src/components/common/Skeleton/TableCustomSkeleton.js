import React from 'react';
import PropTypes from 'prop-types';
import {Skeleton, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

const TableCustomSkeleton = ({ row = 3, column = 6 }) => {
    const rowLength = new Array(row).fill(0);

    const columnLength = new Array(column).fill(0);

    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {rowLength.map((each, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <TableCell key={index}>
                                <Skeleton />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {columnLength.map((each, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <TableRow key={index}>
                            {rowLength.map((each, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <TableCell key={index}>
                                    <Skeleton />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

TableCustomSkeleton.propTypes = {
    row: PropTypes.number,
    column: PropTypes.number,
};

export default TableCustomSkeleton;
